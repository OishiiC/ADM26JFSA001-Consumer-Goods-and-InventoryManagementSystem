package com.retailedge.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemDTO {
    private UUID productId;
    private String productName;
    private Integer quantity;
    private BigDecimal price;
}
