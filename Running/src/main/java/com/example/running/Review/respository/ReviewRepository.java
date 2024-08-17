package com.example.running.Review.respository;

import com.example.running.Review.domain.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findTop5ByOrderByRegDateDesc();
}
