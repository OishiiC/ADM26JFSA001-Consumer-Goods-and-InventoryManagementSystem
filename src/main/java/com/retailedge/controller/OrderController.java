package com.retailedge.controller;

import com.retailedge.dto.request.OrderRequestDTO;
import com.retailedge.dto.request.UpdateOrderStatusRequest;
import com.retailedge.dto.response.OrderDTO;
import com.retailedge.service.OrderService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    
    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);
    
    @Autowired
    private OrderService orderService;
    
    @PostMapping("/place")
    public ResponseEntity<OrderDTO> placeOrder(
            @Valid @RequestBody OrderRequestDTO orderRequestDTO,
            Authentication authentication) {
        String userEmail = authentication.getName();
        logger.info("🛒 POST /api/orders/place - Placing order for user: {} with {} items", 
                   userEmail, orderRequestDTO.getItems().size());
        try {
            OrderDTO order = orderService.placeOrder(orderRequestDTO, userEmail);
            logger.info("✅ Order placed successfully - Order ID: {}, User: {}, Total: {}", 
                       order.getId(), userEmail, order.getTotal());
            return ResponseEntity.status(HttpStatus.CREATED).body(order);
        } catch (Exception e) {
            logger.error("❌ Error placing order for user: {} with {} items", 
                        userEmail, orderRequestDTO.getItems().size(), e);
            throw e;
        }
    }
    
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OrderDTO>> getAllOrders() {
        logger.info("🛒 GET /api/orders - Fetching all orders");
        try {
            List<OrderDTO> orders = orderService.getAllOrders();
            logger.debug("✅ Retrieved {} orders", orders.size());
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            logger.error("❌ Error fetching all orders", e);
            throw e;
        }
    }
    
    @GetMapping("/my-orders")
    public ResponseEntity<List<OrderDTO>> getMyOrders(Authentication authentication) {
        String userEmail = authentication.getName();
        logger.info("🛒 GET /api/orders/my-orders - Fetching orders for user: {}", userEmail);
        try {
            List<OrderDTO> orders = orderService.getMyOrders(userEmail);
            logger.debug("✅ Retrieved {} orders for user: {}", orders.size(), userEmail);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            logger.error("❌ Error fetching orders for user: {}", userEmail, e);
            throw e;
        }
    }
    
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OrderDTO> updateOrderStatus(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateOrderStatusRequest request) {
        logger.info("🛒 PUT /api/orders/{}/status - Updating order status to: {}", id, request.getStatus());
        try {
            OrderDTO order = orderService.updateOrderStatus(id, request.getStatus());
            logger.info("✅ Order status updated successfully - Order ID: {}, New Status: {}", 
                       id, order.getStatus());
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            logger.error("❌ Error updating order status - Order ID: {}, Status: {}", id, request.getStatus(), e);
            throw e;
        }
    }
}
