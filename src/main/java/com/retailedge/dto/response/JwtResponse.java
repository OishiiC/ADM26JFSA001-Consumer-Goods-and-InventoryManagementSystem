package com.retailedge.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JwtResponse {
    private String token;
    private UUID id;
    private String email;
    private String name;
    private List<String> roles;
}
