package com.retailedge.controller;

import com.retailedge.dto.response.KeyMetricsDTO;
import com.retailedge.dto.response.SalesDataDTO;
import com.retailedge.dto.response.TopProductDTO;
import com.retailedge.service.DashboardService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@PreAuthorize("hasRole('ADMIN')")
public class DashboardController {
    
    private static final Logger logger = LoggerFactory.getLogger(DashboardController.class);
    
    @Autowired
    private DashboardService dashboardService;
    
    @GetMapping("/metrics")
    public ResponseEntity<KeyMetricsDTO> getKeyMetrics() {
        logger.info("📊 GET /api/dashboard/metrics - Fetching key metrics");
        try {
            KeyMetricsDTO metrics = dashboardService.getKeyMetrics();
            logger.debug("✅ Key metrics retrieved - Revenue: {}, Orders: {}, Customers: {}", 
                        metrics.getTotalRevenue(), metrics.getTotalOrders(), metrics.getNewCustomers());
            return ResponseEntity.ok(metrics);
        } catch (Exception e) {
            logger.error("❌ Error fetching key metrics", e);
            throw e;
        }
    }
    
    @GetMapping("/sales")
    public ResponseEntity<List<SalesDataDTO>> getSalesData(
            @RequestParam(required = false, defaultValue = "monthly") String period) {
        logger.info("📈 GET /api/dashboard/sales - Fetching sales data for period: {}", period);
        try {
            List<SalesDataDTO> salesData = dashboardService.getSalesData(period);
            logger.debug("✅ Sales data retrieved successfully - Period: {}, Records: {}", period, salesData.size());
            return ResponseEntity.ok(salesData);
        } catch (Exception e) {
            logger.error("❌ Error fetching sales data - Period: {}", period, e);
            throw e;
        }
    }
    
    @GetMapping("/top-products")
    public ResponseEntity<List<TopProductDTO>> getTopProducts() {
        logger.info("🏆 GET /api/dashboard/top-products - Fetching top products");
        try {
            List<TopProductDTO> topProducts = dashboardService.getTopProducts();
            logger.debug("✅ Top products retrieved successfully - Count: {}", topProducts.size());
            return ResponseEntity.ok(topProducts);
        } catch (Exception e) {
            logger.error("❌ Error fetching top products", e);
            throw e;
        }
    }
}
