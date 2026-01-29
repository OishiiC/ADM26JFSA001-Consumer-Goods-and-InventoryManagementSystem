package com.retailedge.repository;

import com.retailedge.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    
    @Query("SELECT oi.product.id as productId, oi.product.name as productName, SUM(oi.quantity) as unitsSold " +
           "FROM OrderItem oi " +
           "GROUP BY oi.product.id, oi.product.name " +
           "ORDER BY SUM(oi.quantity) DESC")
    List<Map<String, Object>> findTopSellingProducts();
}
