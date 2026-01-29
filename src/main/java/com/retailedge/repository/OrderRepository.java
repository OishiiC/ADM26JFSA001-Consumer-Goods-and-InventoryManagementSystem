package com.retailedge.repository;

import com.retailedge.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface OrderRepository extends JpaRepository<Order, UUID> {
    List<Order> findByUserIdOrderByOrderDateDesc(UUID userId);
    List<Order> findAllByOrderByOrderDateDesc();
    
    @Query("SELECT COUNT(DISTINCT o.user.id) FROM Order o WHERE o.createdAt >= :date")
    Long countNewCustomers(LocalDateTime date);
}
