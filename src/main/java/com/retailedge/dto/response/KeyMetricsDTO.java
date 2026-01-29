package com.retailedge.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class KeyMetricsDTO {
    private BigDecimal totalRevenue;
    private Long totalOrders;
    private Long newCustomers;
}
