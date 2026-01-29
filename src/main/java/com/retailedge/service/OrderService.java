package com.retailedge.service;

import com.retailedge.dto.request.OrderItemRequestDTO;
import com.retailedge.dto.request.OrderRequestDTO;
import com.retailedge.dto.response.OrderDTO;
import com.retailedge.dto.response.OrderItemDTO;
import com.retailedge.entity.Order;
import com.retailedge.entity.OrderItem;
import com.retailedge.entity.Product;
import com.retailedge.entity.User;
import com.retailedge.enums.OrderStatus;
import com.retailedge.exception.BadRequestException;
import com.retailedge.exception.ResourceNotFoundException;
import com.retailedge.repository.OrderRepository;
import com.retailedge.repository.ProductRepository;
import com.retailedge.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OrderService {
    
    private static final Logger logger = LoggerFactory.getLogger(OrderService.class);
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Transactional
    public OrderDTO placeOrder(OrderRequestDTO orderRequestDTO, String userEmail) {
        logger.info("🛒 Processing order placement for user: {} with {} items", userEmail, orderRequestDTO.getItems().size());
        try {
            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> {
                        logger.warn("⚠️ User not found for order - Email: {}", userEmail);
                        return new ResourceNotFoundException("User not found");
                    });
            
            Order order = new Order();
            order.setUser(user);
            order.setOrderDate(LocalDateTime.now());
            order.setStatus(OrderStatus.PENDING);
            
            BigDecimal total = BigDecimal.ZERO;
            
            for (OrderItemRequestDTO itemRequest : orderRequestDTO.getItems()) {
                logger.debug("Processing order item - Product ID: {}, Quantity: {}", 
                            itemRequest.getProductId(), itemRequest.getQuantity());
                
                UUID productId = UUID.fromString(itemRequest.getProductId());
                Product product = productRepository.findById(productId)
                        .orElseThrow(() -> {
                            logger.warn("⚠️ Product not found in order - Product ID: {}", productId);
                            return new ResourceNotFoundException("Product not found with id: " + productId);
                        });
                
                // Check stock availability
                if (product.getStock() < itemRequest.getQuantity()) {
                    logger.warn("⚠️ Insufficient stock - Product: {}, Available: {}, Requested: {}", 
                               product.getName(), product.getStock(), itemRequest.getQuantity());
                    throw new BadRequestException("Insufficient stock for product: " + product.getName() + 
                            ". Available: " + product.getStock() + ", Requested: " + itemRequest.getQuantity());
                }
                
                OrderItem orderItem = new OrderItem();
                orderItem.setProduct(product);
                orderItem.setQuantity(itemRequest.getQuantity());
                orderItem.setPrice(product.getPrice());
                order.addItem(orderItem);
                
                // Calculate total
                BigDecimal itemTotal = product.getPrice().multiply(new BigDecimal(itemRequest.getQuantity()));
                total = total.add(itemTotal);
                
                // Decrement stock
                int newStock = product.getStock() - itemRequest.getQuantity();
                product.setStock(newStock);
                productRepository.save(product);
                logger.debug("✅ Stock reduced for product: {} - New stock: {}", product.getName(), newStock);
                
                // Check if product is below low stock threshold
                if (newStock < product.getLowStockThreshold()) {
                    logger.warn("⚠️ CRITICAL: Product {} stock is below threshold! Current: {}, Threshold: {}", 
                               product.getName(), newStock, product.getLowStockThreshold());
                }
            }
            
            order.setTotal(total);
            Order savedOrder = orderRepository.save(order);
            
            logger.info("✅ Order placed successfully - Order ID: {}, User: {}, Total: {}, Items: {}", 
                       savedOrder.getId(), userEmail, total, savedOrder.getItems().size());
            
            return convertToDTO(savedOrder);
        } catch (BadRequestException | ResourceNotFoundException e) {
            throw e;
        } catch (Exception e) {
            logger.error("❌ Error placing order for user: {} with {} items", 
                        userEmail, orderRequestDTO.getItems().size(), e);
            throw e;
        }
    }
    
    public List<OrderDTO> getAllOrders() {
        logger.debug("Fetching all orders");
        try {
            List<Order> orders = orderRepository.findAllByOrderByOrderDateDesc();
            logger.info("✅ Retrieved {} orders", orders.size());
            return orders.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("❌ Error fetching all orders", e);
            throw e;
        }
    }
    
    public List<OrderDTO> getMyOrders(String userEmail) {
        logger.debug("Fetching orders for user: {}", userEmail);
        try {
            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> {
                        logger.warn("⚠️ User not found - Email: {}", userEmail);
                        return new ResourceNotFoundException("User not found");
                    });
            
            List<Order> orders = orderRepository.findByUserIdOrderByOrderDateDesc(user.getId());
            logger.info("✅ Retrieved {} orders for user: {}", orders.size(), userEmail);
            
            return orders.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (Exception e) {
            logger.error("❌ Error fetching orders for user: {}", userEmail, e);
            throw e;
        }
    }
    
    @Transactional
    public OrderDTO updateOrderStatus(UUID orderId, String status) {
        logger.info("Updating order status - Order ID: {}, New Status: {}", orderId, status);
        try {
            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> {
                        logger.warn("⚠️ Order not found - Order ID: {}", orderId);
                        return new ResourceNotFoundException("Order not found with id: " + orderId);
                    });
            
            try {
                OrderStatus oldStatus = order.getStatus();
                OrderStatus orderStatus = OrderStatus.valueOf(status.toUpperCase());
                order.setStatus(orderStatus);
                Order updatedOrder = orderRepository.save(order);
                logger.info("✅ Order status updated - Order ID: {}, Old Status: {}, New Status: {}", 
                           orderId, oldStatus, orderStatus);
                return convertToDTO(updatedOrder);
            } catch (IllegalArgumentException e) {
                logger.error("❌ Invalid order status: {}", status);
                throw new BadRequestException("Invalid order status: " + status);
            }
        } catch (ResourceNotFoundException | BadRequestException e) {
            throw e;
        } catch (Exception e) {
            logger.error("❌ Error updating order status - Order ID: {}, Status: {}", orderId, status, e);
            throw e;
        }
    }
    
    private OrderDTO convertToDTO(Order order) {
        List<OrderItemDTO> itemDTOs = order.getItems().stream()
                .map(item -> new OrderItemDTO(
                        item.getProduct().getId(),
                        item.getProduct().getName(),
                        item.getQuantity(),
                        item.getPrice()
                ))
                .collect(Collectors.toList());
        
        DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE;
        String dateStr = order.getOrderDate().format(formatter);
        
        return new OrderDTO(
                order.getId(),
                order.getUser().getName(),
                dateStr,
                order.getStatus().name(),
                order.getTotal(),
                itemDTOs
        );
    }
}
