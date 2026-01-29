package com.retailedge.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InventoryItemDTO {
    private UUID productId;
    private String productName;
    private Integer stock;
    private Integer lowStockThreshold;
}
