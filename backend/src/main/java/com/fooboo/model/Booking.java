package com.fooboo.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "booking")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "food_item_id")
    private FoodItem foodItem;

    @Column(nullable = false)
    private LocalDate date = LocalDate.now();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MealTime mealTime;  // BREAKFAST / LUNCH / DINNER

    @Column(nullable = false)
    private String status = "PENDING";
}
