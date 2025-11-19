package com.fooboo.service;

import com.fooboo.exception.BadRequestException;
import com.fooboo.exception.ResourceNotFoundException;
import com.fooboo.model.*;
import com.fooboo.repository.BookingRepository;
import com.fooboo.repository.FoodItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepo;
    private final FoodItemRepository foodRepo;
    private final PointsService pointsService;

    public BookingService(BookingRepository bookingRepo,
                          FoodItemRepository foodRepo,
                          PointsService pointsService) {
        this.bookingRepo = bookingRepo;
        this.foodRepo = foodRepo;
        this.pointsService = pointsService;
    }

    @Transactional
    public Booking createBooking(User user, Long foodItemId, MealTime mealTime) {

        FoodItem food = foodRepo.findById(foodItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Food item not found"));

        if (!food.getAvailable()) {
            throw new BadRequestException("Food item '" + food.getName() + "' is unavailable");
        }

        boolean alreadyBooked = bookingRepo
                .findByUser(user)
                .stream()
                .anyMatch(b -> b.getDate().equals(LocalDate.now()) &&
                        b.getMealTime() == mealTime);

        if (alreadyBooked) {
            throw new BadRequestException("You already booked a meal for " + mealTime);
        }

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setFoodItem(food);
        booking.setDate(LocalDate.now());
        booking.setMealTime(mealTime);
        booking.setStatus("CONFIRMED");

        Booking saved = bookingRepo.save(booking);
        pointsService.addPoints(user, 10, "Booked " + food.getName() + " for " + mealTime);

        return saved;
    }

    public List<Booking> getUserBookings(User user) {
        return bookingRepo.findByUser(user);
    }

    public List<Booking> getAllBookings() {
        return bookingRepo.findAll();
    }

    @Transactional
    public Booking cancelBooking(Long id, User user) {

        Booking booking = bookingRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (!booking.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("You cannot cancel another user's booking");
        }

        if ("CANCELLED".equals(booking.getStatus())) {
            throw new BadRequestException("Booking already cancelled");
        }

        booking.setStatus("CANCELLED");
        bookingRepo.save(booking);

        pointsService.addPoints(user, -5, "Cancelled booking for " + booking.getMealTime());

        return booking;
    }
}
