package com.retailedge.service;

import com.retailedge.dto.request.ProductDTO;
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
public class ProductService {
    
    private static final Logger logger = LoggerFactory.getLogger(ProductService.class);
    
    @Autowired
    private ProductRepository productRepository;
    
    public List<ProductDTO> getAllProducts(String search, String category) {
        logger.debug("Fetching all products - search: {}, category: {}", search, category);
        try {
            List<Product> products;
            
            if (search != null && !search.isEmpty() && category != null && !category.isEmpty()) {
                logger.debug("Applying both search and category filters");
                products = productRepository.findByNameContainingIgnoreCaseAndCategory(search, category);
            } else if (search != null && !search.isEmpty()) {
                logger.debug("Applying search filter: {}", search);
                products = productRepository.findByNameContainingIgnoreCase(search);
            } else if (category != null && !category.isEmpty()) {
                logger.debug("Applying category filter: {}", category);
                products = productRepository.findByCategory(category);
            } else {
                logger.debug("Fetching all products without filters");
                products = productRepository.findAll();
            }
            
            logger.info("✅ Retrieved {} products", products.size());
            return products.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("❌ Error fetching products - search: {}, category: {}", search, category, e);
            throw e;
        }
    }
    
    public ProductDTO getProductById(UUID id) {
        logger.debug("Fetching product by ID: {}", id);
        try {
            Product product = productRepository.findById(id)
                    .orElseThrow(() -> {
                        logger.warn("⚠️ Product not found with ID: {}", id);
                        return new ResourceNotFoundException("Product not found with id: " + id);
                    });
            logger.info("✅ Product retrieved - ID: {}, Name: {}", id, product.getName());
            return convertToDTO(product);
        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (Exception e) {
            logger.error("❌ Error fetching product - ID: {}", id, e);
            throw e;
        }
    }
    
    @Transactional
    public ProductDTO createProduct(ProductDTO productDTO) {
        logger.debug("Creating new product - Name: {}, Category: {}, Price: {}", 
                    productDTO.getName(), productDTO.getCategory(), productDTO.getPrice());
        try {
            Product product = new Product();
            product.setName(productDTO.getName());
            product.setCategory(productDTO.getCategory());
            product.setPrice(productDTO.getPrice());
            product.setStock(productDTO.getStock());
            product.setImageUrl(productDTO.getImageUrl());
            product.setLowStockThreshold(productDTO.getLowStockThreshold());
            
            Product savedProduct = productRepository.save(product);
            logger.info("✅ Product created successfully - ID: {}, Name: {}", savedProduct.getId(), savedProduct.getName());
            
            if (savedProduct.getStock() < savedProduct.getLowStockThreshold()) {
                logger.warn("⚠️ Product {} created with low initial stock: {}", savedProduct.getName(), savedProduct.getStock());
            }
            
            return convertToDTO(savedProduct);
        } catch (Exception e) {
            logger.error("❌ Error creating product - Name: {}", productDTO.getName(), e);
            throw e;
        }
    }
    
    @Transactional
    public ProductDTO updateProduct(UUID id, ProductDTO productDTO) {
        logger.debug("Updating product - ID: {}, Name: {}", id, productDTO.getName());
        try {
            Product product = productRepository.findById(id)
                    .orElseThrow(() -> {
                        logger.warn("⚠️ Product not found for update - ID: {}", id);
                        return new ResourceNotFoundException("Product not found with id: " + id);
                    });
            
            product.setName(productDTO.getName());
            product.setCategory(productDTO.getCategory());
            product.setPrice(productDTO.getPrice());
            product.setStock(productDTO.getStock());
            product.setImageUrl(productDTO.getImageUrl());
            product.setLowStockThreshold(productDTO.getLowStockThreshold());
            
            Product updatedProduct = productRepository.save(product);
            logger.info("✅ Product updated successfully - ID: {}, Name: {}", id, updatedProduct.getName());
            
            if (updatedProduct.getStock() < updatedProduct.getLowStockThreshold()) {
                logger.warn("⚠️ Updated product {} has stock below threshold: {}", updatedProduct.getName(), updatedProduct.getStock());
            }
            
            return convertToDTO(updatedProduct);
        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (Exception e) {
            logger.error("❌ Error updating product - ID: {}", id, e);
            throw e;
        }
    }
    
    @Transactional
    public void deleteProduct(UUID id) {
        logger.debug("Deleting product - ID: {}", id);
        try {
            Product product = productRepository.findById(id)
                    .orElseThrow(() -> {
                        logger.warn("⚠️ Product not found for deletion - ID: {}", id);
                        return new ResourceNotFoundException("Product not found with id: " + id);
                    });
            productRepository.delete(product);
            logger.info("✅ Product deleted successfully - ID: {}", id);
        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (Exception e) {
            logger.error("❌ Error deleting product - ID: {}", id, e);
            throw e;
        }
    }
    
    private ProductDTO convertToDTO(Product product) {
        return new ProductDTO(
                product.getId(),
                product.getName(),
                product.getCategory(),
                product.getPrice(),
                product.getStock(),
                product.getImageUrl(),
                product.getLowStockThreshold()
        );
    }
}
