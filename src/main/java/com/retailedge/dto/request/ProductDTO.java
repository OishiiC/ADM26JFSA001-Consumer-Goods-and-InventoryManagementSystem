package com.retailedge.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
    
    private UUID id;
    
    @NotBlank(message = "Product name is required")
    private String name;
    
    @NotBlank(message = "Category is required")
    private String category;
    
    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than zero")
    private BigDecimal price;
    
    @NotNull(message = "Stock is required")
    @Min(value = 0, message = "Stock cannot be negative")
    private Integer stock;
    
    private String imageUrl;
    
    @NotNull(message = "Low stock threshold is required")
    @Min(value = 0, message = "Low stock threshold cannot be negative")
    private Integer lowStockThreshold;
}
