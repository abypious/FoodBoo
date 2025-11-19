package com.fooboo.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "points_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PointsHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private Integer changeAmount;
    private String description;
    private LocalDateTime createdAt = LocalDateTime.now();
}
