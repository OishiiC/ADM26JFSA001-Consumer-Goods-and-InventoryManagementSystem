package com.retailedge.service;

import com.retailedge.dto.response.KeyMetricsDTO;
import com.retailedge.dto.response.SalesDataDTO;
import com.retailedge.dto.response.TopProductDTO;
import com.retailedge.entity.Order;
import com.retailedge.repository.OrderItemRepository;
import com.retailedge.repository.OrderRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class DashboardService {
    
    private static final Logger logger = LoggerFactory.getLogger(DashboardService.class);
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private OrderItemRepository orderItemRepository;
    
    public KeyMetricsDTO getKeyMetrics() {
        logger.debug("Calculating key metrics...");
        try {
            List<Order> allOrders = orderRepository.findAll();
            
            BigDecimal totalRevenue = allOrders.stream()
                    .map(Order::getTotal)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            
            Long totalOrders = (long) allOrders.size();
            
            // New customers in the last 30 days
            LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
            Long newCustomers = orderRepository.countNewCustomers(thirtyDaysAgo);
            
            logger.info("✅ Key metrics calculated - Revenue: {}, Orders: {}, New Customers: {}", 
                       totalRevenue, totalOrders, newCustomers);
            
            return new KeyMetricsDTO(totalRevenue, totalOrders, newCustomers);
        } catch (Exception e) {
            logger.error("❌ Error calculating key metrics", e);
            throw e;
        }
    }
    
    public List<SalesDataDTO> getSalesData(String period) {
        logger.debug("Fetching sales data for period: {}", period);
        try {
            List<Order> orders = orderRepository.findAll();
            
            // Make period effectively final for lambda use
            final String finalPeriod = (period == null || period.isEmpty()) ? "monthly" : period;
            
            // For simplicity, returning aggregated sales by period
            Map<String, BigDecimal> salesByPeriod = orders.stream()
                    .collect(Collectors.groupingBy(
                            order -> formatPeriod(order.getOrderDate(), finalPeriod),
                            Collectors.reducing(BigDecimal.ZERO, Order::getTotal, BigDecimal::add)
                    ));
            
            List<SalesDataDTO> result = salesByPeriod.entrySet().stream()
                    .map(entry -> new SalesDataDTO(entry.getKey(), entry.getValue()))
                    .collect(Collectors.toList());
            
            logger.info("✅ Sales data retrieved - Period: {}, Records: {}", finalPeriod, result.size());
            return result;
        } catch (Exception e) {
            logger.error("❌ Error fetching sales data for period: {}", period, e);
            throw e;
        }
    }
    
    public List<TopProductDTO> getTopProducts() {
        logger.debug("Fetching top 5 selling products...");
        try {
            List<Map<String, Object>> topProducts = orderItemRepository.findTopSellingProducts();
            
            List<TopProductDTO> result = topProducts.stream()
                    .limit(5)
                    .map(map -> {
                        UUID productId = (UUID) map.get("productId");
                        String productName = (String) map.get("productName");
                        Long unitsSold = ((Number) map.get("unitsSold")).longValue();
                        return new TopProductDTO(productId, productName, unitsSold);
                    })
                    .collect(Collectors.toList());
            
            logger.info("✅ Top products retrieved - Count: {}", result.size());
            return result;
        } catch (Exception e) {
            logger.error("❌ Error fetching top products", e);
            throw e;
        }
    }
    
    private String formatPeriod(LocalDateTime dateTime, String period) {
        logger.debug("Formatting period - DateTime: {}, Period Type: {}", dateTime, period);
        DateTimeFormatter formatter;
        
        switch (period.toLowerCase()) {
            case "daily":
                formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
                break;
            case "quarterly":
                int quarter = (dateTime.getMonthValue() - 1) / 3 + 1;
                return dateTime.getYear() + "-Q" + quarter;
            case "yearly":
                formatter = DateTimeFormatter.ofPattern("yyyy");
                break;
            case "monthly":
            default:
                formatter = DateTimeFormatter.ofPattern("yyyy-MM");
                break;
        }
        
        return dateTime.format(formatter);
    }
}
