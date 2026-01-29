package com.retailedge.controller;

import com.retailedge.dto.request.ProductDTO;
import com.retailedge.service.ProductService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    
    private static final Logger logger = LoggerFactory.getLogger(ProductController.class);
    
    @Autowired
    private ProductService productService;
    
    @GetMapping
    public ResponseEntity<List<ProductDTO>> getAllProducts(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category) {
        logger.info("📦 GET /api/products - Fetching all products - search: {}, category: {}", search, category);
        try {
            List<ProductDTO> products = productService.getAllProducts(search, category);
            logger.debug("✅ Retrieved {} products", products.size());
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            logger.error("❌ Error fetching products - search: {}, category: {}", search, category, e);
            throw e;
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable UUID id) {
        logger.info("📦 GET /api/products/{} - Fetching product by ID", id);
        try {
            ProductDTO product = productService.getProductById(id);
            logger.debug("✅ Product retrieved - Name: {}", product.getName());
            return ResponseEntity.ok(product);
        } catch (Exception e) {
            logger.error("❌ Error fetching product - ID: {}", id, e);
            throw e;
        }
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductDTO> createProduct(@Valid @RequestBody ProductDTO productDTO) {
        logger.info("📦 POST /api/products - Creating new product - Name: {}, Category: {}, Price: {}", 
                   productDTO.getName(), productDTO.getCategory(), productDTO.getPrice());
        try {
            ProductDTO createdProduct = productService.createProduct(productDTO);
            logger.info("✅ Product created successfully - ID: {}, Name: {}", createdProduct.getId(), createdProduct.getName());
            return ResponseEntity.status(HttpStatus.CREATED).body(createdProduct);
        } catch (Exception e) {
            logger.error("❌ Error creating product - Name: {}", productDTO.getName(), e);
            throw e;
        }
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductDTO> updateProduct(
            @PathVariable UUID id,
            @Valid @RequestBody ProductDTO productDTO) {
        logger.info("📦 PUT /api/products/{} - Updating product - Name: {}, Category: {}", 
                   id, productDTO.getName(), productDTO.getCategory());
        try {
            ProductDTO updatedProduct = productService.updateProduct(id, productDTO);
            logger.info("✅ Product updated successfully - ID: {}, Name: {}", id, updatedProduct.getName());
            return ResponseEntity.ok(updatedProduct);
        } catch (Exception e) {
            logger.error("❌ Error updating product - ID: {}", id, e);
            throw e;
        }
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteProduct(@PathVariable UUID id) {
        logger.info("📦 DELETE /api/products/{} - Deleting product", id);
        try {
            productService.deleteProduct(id);
            logger.info("✅ Product deleted successfully - ID: {}", id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            logger.error("❌ Error deleting product - ID: {}", id, e);
            throw e;
        }
    }
}
