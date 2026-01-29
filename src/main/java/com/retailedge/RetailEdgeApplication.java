package com.retailedge;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;

@SpringBootApplication
public class RetailEdgeApplication {
    
    private static final Logger logger = LoggerFactory.getLogger(RetailEdgeApplication.class);

    public static void main(String[] args) {
        logger.info("🚀 Starting RetailEdge Application...");
        ConfigurableApplicationContext context = SpringApplication.run(RetailEdgeApplication.class, args);
        logger.info("✅ RetailEdge Application started successfully on port: {}", getServerPort(context));
        
        // Log shutdown hook
        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            logger.info("⏹️ RetailEdge Application is shutting down...");
        }));
    }
    
    private static String getServerPort(ConfigurableApplicationContext context) {
        return context.getEnvironment().getProperty("server.port", "8080");
    }
}
