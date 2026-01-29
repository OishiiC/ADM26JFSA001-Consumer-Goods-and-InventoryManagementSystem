package com.retailedge.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateThresholdRequest {
    
    @NotNull(message = "Threshold is required")
    @Min(value = 0, message = "Threshold cannot be negative")
    private Integer threshold;
}
