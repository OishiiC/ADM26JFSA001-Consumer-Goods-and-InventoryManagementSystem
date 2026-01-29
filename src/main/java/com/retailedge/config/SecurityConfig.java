package com.retailedge.config;

import com.retailedge.security.UserDetailsServiceImpl;
import com.retailedge.security.jwt.AuthEntryPointJwt;
import com.retailedge.security.jwt.JwtAuthenticationFilter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    
    private static final Logger logger = LoggerFactory.getLogger(SecurityConfig.class);
    
    @Autowired
    private UserDetailsServiceImpl userDetailsService;
    
    @Autowired
    private AuthEntryPointJwt unauthorizedHandler;
    
    @Value("${cors.allowed.origins}")
    private String allowedOrigins;
    
    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        logger.debug("Initializing JWT Authentication Filter");
        return new JwtAuthenticationFilter();
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        logger.debug("Initializing BCrypt Password Encoder");
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        logger.debug("Initializing Authentication Manager");
        return authConfig.getAuthenticationManager();
    }
    
    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        logger.debug("Initializing DAO Authentication Provider");
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        logger.debug("Configuring Security Filter Chain");
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/actuator/**").permitAll()
                .requestMatchers("/api/products/**").hasAnyRole("USER", "ADMIN")
                .requestMatchers("/api/orders/place").hasAnyRole("USER", "ADMIN")
                .requestMatchers("/api/orders/my-orders").hasAnyRole("USER", "ADMIN")
                .requestMatchers("/api/orders/**").hasRole("ADMIN")
                .requestMatchers("/api/inventory/**").hasRole("ADMIN")
                .requestMatchers("/api/dashboard/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            );
        
        http.authenticationProvider(authenticationProvider());
        http.addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);
        
        logger.info("✅ Security configuration initialized");
        return http.build();
    }
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        logger.debug("Configuring CORS with allowed origins: {}", allowedOrigins);
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
