package com.retailedge.config;

import com.retailedge.entity.Product;
import com.retailedge.entity.Role;
import com.retailedge.entity.User;
import com.retailedge.enums.RoleType;
import com.retailedge.repository.ProductRepository;
import com.retailedge.repository.RoleRepository;
import com.retailedge.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {
    
    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);
    
    @Autowired
    private RoleRepository roleRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        logger.info("Starting database initialization...");
        
        // Initialize roles if they don't exist
        Role userRole = roleRepository.findByName(RoleType.ROLE_USER).orElse(null);
        Role adminRole = roleRepository.findByName(RoleType.ROLE_ADMIN).orElse(null);
        
        if (userRole == null) {
            logger.debug("ROLE_USER not found, creating it...");
            userRole = new Role();
            userRole.setName(RoleType.ROLE_USER);
            userRole = roleRepository.save(userRole);
            logger.info("✅ Created role: ROLE_USER");
        } else {
            logger.debug("ROLE_USER already exists");
        }
        
        if (adminRole == null) {
            logger.debug("ROLE_ADMIN not found, creating it...");
            adminRole = new Role();
            adminRole.setName(RoleType.ROLE_ADMIN);
            adminRole = roleRepository.save(adminRole);
            logger.info("✅ Created role: ROLE_ADMIN");
        } else {
            logger.debug("ROLE_ADMIN already exists");
        }
        
        // Initialize default admin user if doesn't exist
        if (!userRepository.existsByEmail("admin@example.com")) {
            logger.debug("Creating default admin user...");
            User adminUser = new User();
            adminUser.setName("Admin User");
            adminUser.setEmail("admin@example.com");
            adminUser.setPassword(passwordEncoder.encode("password123"));
            
            Set<Role> adminRoles = new HashSet<>();
            adminRoles.add(adminRole);
            adminUser.setRoles(adminRoles);
            
            userRepository.save(adminUser);
            logger.info("✅ Admin user created: admin@example.com / password123");
        } else {
            logger.debug("Admin user already exists");
        }
        
        // Initialize regular user if doesn't exist
        if (!userRepository.existsByEmail("user@example.com")) {
            logger.debug("Creating default regular user...");
            User regularUser = new User();
            regularUser.setName("John Doe");
            regularUser.setEmail("user@example.com");
            regularUser.setPassword(passwordEncoder.encode("password123"));
            
            Set<Role> userRoles = new HashSet<>();
            userRoles.add(userRole);
            regularUser.setRoles(userRoles);
            
            userRepository.save(regularUser);
            logger.info("✅ Regular user created: user@example.com / password123");
        } else {
            logger.debug("Regular user already exists");
        }
        
        // Initialize sample products if they don't exist
        if (productRepository.count() == 0) {
            logger.debug("No products found, creating sample products...");
            Product p1 = new Product();
            p1.setName("Smartwatch Pro");
            p1.setCategory("Electronics");
            p1.setPrice(new BigDecimal("299.99"));
            p1.setStock(150);
            p1.setImageUrl("https://picsum.photos/seed/smartwatch/200");
            p1.setLowStockThreshold(30);
            productRepository.save(p1);
            
            Product p2 = new Product();
            p2.setName("Organic Coffee Beans");
            p2.setCategory("Groceries");
            p2.setPrice(new BigDecimal("22.50"));
            p2.setStock(300);
            p2.setImageUrl("https://picsum.photos/seed/coffee/200");
            p2.setLowStockThreshold(100);
            productRepository.save(p2);
            
            Product p3 = new Product();
            p3.setName("Designer Denim Jacket");
            p3.setCategory("Apparel");
            p3.setPrice(new BigDecimal("149.00"));
            p3.setStock(80);
            p3.setImageUrl("https://picsum.photos/seed/jacket/200");
            p3.setLowStockThreshold(20);
            productRepository.save(p3);
            
            Product p4 = new Product();
            p4.setName("Yoga Mat");
            p4.setCategory("Sports");
            p4.setPrice(new BigDecimal("45.00"));
            p4.setStock(40);
            p4.setImageUrl("https://picsum.photos/seed/yoga/200");
            p4.setLowStockThreshold(50);
            productRepository.save(p4);
            
            Product p5 = new Product();
            p5.setName("Wireless Earbuds");
            p5.setCategory("Electronics");
            p5.setPrice(new BigDecimal("199.99"));
            p5.setStock(120);
            p5.setImageUrl("https://picsum.photos/seed/earbuds/200");
            p5.setLowStockThreshold(25);
            productRepository.save(p5);
            
            logger.info("✅ Sample products created (5 products)");
        } else {
            logger.debug("Products already exist, skipping product initialization");
        }
        
        logger.info("✅ Data initialization complete!");
    }
}
