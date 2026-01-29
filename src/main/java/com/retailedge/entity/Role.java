package com.retailedge.entity;

import com.retailedge.enums.RoleType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "roles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Role {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false, unique = true)
    private RoleType name;
    
    public Role(RoleType name) {
        this.name = name;
    }
}
