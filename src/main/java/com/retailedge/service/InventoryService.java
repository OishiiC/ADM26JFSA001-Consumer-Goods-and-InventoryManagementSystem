package com.retailedge.service;

import com.retailedge.dto.response.InventoryItemDTO;
import com.retailedge.entity.Product;
import com.retailedge.exception.ResourceNotFoundException;
import com.retailedge.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class InventoryService {
    
    private static final Logger logger = LoggerFactory.getLogger(InventoryService.class);
    
    @Autowired
    private ProductRepository productRepository;
    
    public List<InventoryItemDTO> getInventory() {
        logger.debug("Fetching complete inventory...");
        try {
            List<Product> products = productRepository.findAll();
            logger.info("✅ Inventory retrieved - Total products: {}", products.size());
            
            long lowStockCount = products.stream()
                    .filter(p -> p.getStock() < p.getLowStockThreshold())
                    .count();
            
            if (lowStockCount > 0) {
                logger.warn("⚠️ ALERT: {} products have low stock", lowStockCount);
            }
            
            return products.stream()
                    .map(product -> new InventoryItemDTO(
                            product.getId(),
                            product.getName(),
                            product.getStock(),
                            product.getLowStockThreshold()
                    ))
                    .collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("❌ Error fetching inventory", e);
            throw e;
        }
    }
    
    @Transactional
    public InventoryItemDTO updateLowStockThreshold(UUID productId, Integer threshold) {
        logger.info("Updating low stock threshold - Product ID: {}, New Threshold: {}", productId, threshold);
        try {
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> {
                        logger.warn("⚠️ Product not found for threshold update - Product ID: {}", productId);
                        return new ResourceNotFoundException("Product not found with id: " + productId);
                    });
            
            int oldThreshold = product.getLowStockThreshold();
            product.setLowStockThreshold(threshold);
            Product updatedProduct = productRepository.save(product);
            
            logger.info("✅ Low stock threshold updated - Product: {}, Old: {}, New: {}", 
                       product.getName(), oldThreshold, threshold);
            
            if (updatedProduct.getStock() < threshold) {
                logger.warn("⚠️ Product {} current stock ({}) is below new threshold ({})", 
                           updatedProduct.getName(), updatedProduct.getStock(), threshold);
            }
            
            return new InventoryItemDTO(
                    updatedProduct.getId(),
                    updatedProduct.getName(),
                    updatedProduct.getStock(),
                    updatedProduct.getLowStockThreshold()
            );
        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (Exception e) {
            logger.error("❌ Error updating low stock threshold - Product ID: {}", productId, e);
            throw e;
        }
    }
}
