package com.retailedge.controller;

import com.retailedge.dto.request.UpdateThresholdRequest;
import com.retailedge.dto.response.InventoryItemDTO;
import com.retailedge.service.InventoryService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/inventory")
@PreAuthorize("hasRole('ADMIN')")
public class InventoryController {
    
    private static final Logger logger = LoggerFactory.getLogger(InventoryController.class);
    
    @Autowired
    private InventoryService inventoryService;
    
    @GetMapping
    public ResponseEntity<List<InventoryItemDTO>> getInventory() {
        logger.info("📊 GET /api/inventory - Fetching inventory status");
        try {
            List<InventoryItemDTO> inventory = inventoryService.getInventory();
            logger.debug("✅ Inventory retrieved successfully - Total items: {}", inventory.size());
            return ResponseEntity.ok(inventory);
        } catch (Exception e) {
            logger.error("❌ Error fetching inventory", e);
            throw e;
        }
    }
    
@PutMapping("/{productId}/threshold")
    public ResponseEntity<InventoryItemDTO> updateLowStockThreshold(
            @PathVariable UUID productId,
            @Valid @RequestBody UpdateThresholdRequest request) {
        logger.info("📊 PUT /api/inventory/{}/threshold - Updating low stock threshold to: {}", 
                   productId, request.getThreshold());
        try {
            InventoryItemDTO item = inventoryService.updateLowStockThreshold(productId, request.getThreshold());
            logger.info("✅ Low stock threshold updated successfully - Product ID: {}, New Threshold: {}", 
                       productId, request.getThreshold());
            return ResponseEntity.ok(item);
        } catch (Exception e) {
            logger.error("❌ Error updating low stock threshold - Product ID: {}", productId, e);
            throw e;
        }
    }
}
