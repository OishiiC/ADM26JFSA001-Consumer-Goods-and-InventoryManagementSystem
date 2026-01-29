package com.retailedge.repository;

import com.retailedge.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {
    List<Product> findByNameContainingIgnoreCase(String search);
    List<Product> findByCategory(String category);
    
    @Query("SELECT p FROM Product p WHERE " +
           "LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "AND p.category = :category")
    List<Product> findByNameContainingIgnoreCaseAndCategory(String search, String category);
}
