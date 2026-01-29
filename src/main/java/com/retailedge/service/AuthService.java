package com.retailedge.service;

import com.retailedge.dto.request.LoginRequest;
import com.retailedge.dto.request.RegisterRequest;
import com.retailedge.dto.response.JwtResponse;
import com.retailedge.entity.Role;
import com.retailedge.entity.User;
import com.retailedge.enums.RoleType;
import com.retailedge.exception.EmailAlreadyExistsException;
import com.retailedge.repository.RoleRepository;
import com.retailedge.repository.UserRepository;
import com.retailedge.security.jwt.JwtUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AuthService {
    
    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private RoleRepository roleRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private JwtUtils jwtUtils;
    
    @Transactional
    public JwtResponse registerUser(RegisterRequest registerRequest) {
        logger.info("Processing user registration for email: {}", registerRequest.getEmail());
        
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            logger.warn("Registration failed - Email already exists: {}", registerRequest.getEmail());
            throw new EmailAlreadyExistsException("Email is already in use: " + registerRequest.getEmail());
        }
        
        User user = new User();
        user.setName(registerRequest.getName());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        logger.debug("User object created for email: {}", registerRequest.getEmail());
        
        // Assign roles
        Set<String> strRoles = registerRequest.getRole();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null) {
            logger.debug("No roles specified, assigning default ROLE_USER");
            Role userRole = roleRepository.findByName(RoleType.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Error: Role USER not found"));
            roles.add(userRole);
        } else {
            logger.debug("Assigning requested roles to user: {}", strRoles);
            strRoles.forEach(role -> {
                switch (role) {
                    case "admin":
                        Role adminRole = roleRepository.findByName(RoleType.ROLE_ADMIN)
                                .orElseThrow(() -> new RuntimeException("Error: Role ADMIN not found"));
                        roles.add(adminRole);
                        logger.debug("Added ROLE_ADMIN to user");
                        break;
                    default:
                        Role userRole = roleRepository.findByName(RoleType.ROLE_USER)
                                .orElseThrow(() -> new RuntimeException("Error: Role USER not found"));
                        roles.add(userRole);
                        logger.debug("Added ROLE_USER to user");
                }
            });
        }

        user.setRoles(roles);
        
        User savedUser = userRepository.save(user);
        logger.info("✅ User registered successfully with ID: {} and email: {}", savedUser.getId(), savedUser.getEmail());
        
        // Build UserDetails directly from saved user (avoids transaction isolation issue)
        List<GrantedAuthority> authorities = savedUser.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.getName().name()))
                .collect(Collectors.toList());
        
        UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
                .username(savedUser.getEmail())
                .password(savedUser.getPassword())
                .authorities(authorities)
                .build();
        
        String jwt = jwtUtils.generateToken(userDetails);
        logger.debug("JWT token generated for new user: {}", savedUser.getEmail());
        
        List<String> roleNames = authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());
        
        return new JwtResponse(jwt, savedUser.getId(), savedUser.getEmail(), savedUser.getName(), roleNames);
    }
    
    @Transactional(readOnly = true)
    public JwtResponse login(LoginRequest loginRequest) {
        logger.info("Processing login attempt for email: {}", loginRequest.getEmail());
        
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
            );
            logger.debug("User authenticated successfully: {}", loginRequest.getEmail());
            SecurityContextHolder.getContext().setAuthentication(authentication);
            
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String jwt = jwtUtils.generateToken(userDetails);
            logger.debug("JWT token generated for login user: {}", loginRequest.getEmail());
            
            User user = userRepository.findByEmail(loginRequest.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            List<String> roles = userDetails.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toList());
            
            logger.info("✅ User login successful for email: {} with roles: {}", loginRequest.getEmail(), roles);
            return new JwtResponse(jwt, user.getId(), user.getEmail(), user.getName(), roles);
        } catch (Exception e) {
            logger.warn("Login failed for email: {} - {}", loginRequest.getEmail(), e.getMessage());
            throw e;
        }
    }
}
