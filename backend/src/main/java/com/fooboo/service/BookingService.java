package com.fooboo.service;

import com.fooboo.exception.BadRequestException;
import com.fooboo.exception.ResourceNotFoundException;
import com.fooboo.model.*;
import com.fooboo.repository.BookingRepository;
import com.fooboo.repository.FoodItemRepository;
import com.fooboo.repository.ReviewRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepo;
    private final FoodItemRepository foodRepo;
    private final PointsService pointsService;
    private final ReviewRepository reviewRepo;

    public BookingService(BookingRepository bookingRepo,
                          FoodItemRepository foodRepo,
                          PointsService pointsService,
                          ReviewRepository reviewRepo) {

        this.bookingRepo = bookingRepo;
        this.foodRepo = foodRepo;
        this.pointsService = pointsService;
        this.reviewRepo = reviewRepo;
    }

    @Transactional
    public Booking createBooking(User user, Long foodItemId, MealTime mealTime, LocalDate date) {

        FoodItem food = foodRepo.findById(foodItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Food item not found"));

        if (!food.getAvailable()) {
            throw new BadRequestException("Food item '" + food.getName() + "' is unavailable");
        }

        LocalDate bookingDate = (date != null) ? date : LocalDate.now();

            boolean alreadyBooked = bookingRepo
            .findByUser(user)
            .stream()
            .anyMatch(b ->
                    b.getDate().equals(bookingDate) &&
                    b.getMealTime() == mealTime &&
                    b.getStatus().equals("CONFIRMED")
            );


        if (alreadyBooked) {
            throw new BadRequestException("You already booked " + mealTime + " on " + bookingDate);
        }

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setFoodItem(food);
        booking.setDate(bookingDate);
        booking.setMealTime(mealTime);
        booking.setStatus("CONFIRMED");

        Booking saved = bookingRepo.save(booking);

        pointsService.addPoints(user, 10, "Booked " + food.getName() + " for " + mealTime);

        return saved;
    }

    /** Auto-change CONFIRMED → COMPLETED once its time window passes for today */
    private void updateStatusIfExpired(Booking booking) {
        if (!"CONFIRMED".equals(booking.getStatus())) return;

        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();

        if (!booking.getDate().equals(today)) return;

        LocalTime cutoff;
        switch (booking.getMealTime()) {
            case BREAKFAST -> cutoff = LocalTime.of(10, 0);
            case LUNCH     -> cutoff = LocalTime.of(14, 0);
            case DINNER    -> cutoff = LocalTime.of(21, 0);
            default        -> cutoff = LocalTime.MAX;
        }

        if (now.isAfter(cutoff)) {
            booking.setStatus("COMPLETED");
            bookingRepo.save(booking);
        }
    }

    /** Set hasReview flag for frontend */
    private void attachHasReview(Booking booking) {
        reviewRepo.findByBookingId(booking.getId())
            .ifPresent(r -> {
                booking.setHasReview(true);
                booking.setReviewId(r.getId());
            });
    }

    public List<Booking> getUserBookings(User user) {
        List<Booking> bookings = bookingRepo.findByUser(user);

        bookings.forEach(b -> {
            updateStatusIfExpired(b);
            attachHasReview(b);
        });

        return bookings;
    }

    public List<Booking> getAllBookings() {
        List<Booking> bookings = bookingRepo.findAll();
        bookings.forEach(this::attachHasReview);
        return bookings;
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

        if ("COMPLETED".equals(booking.getStatus())) {
            throw new BadRequestException("You cannot cancel a completed booking");
        }

        booking.setStatus("CANCELLED");
        bookingRepo.save(booking);

        pointsService.addPoints(user, -5, "Cancelled booking for " + booking.getMealTime());

        return booking;
    }
}
