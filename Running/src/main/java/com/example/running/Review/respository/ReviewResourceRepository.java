package com.example.running.Review.respository;

import com.example.running.Review.domain.ReviewResource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ReviewResourceRepository extends JpaRepository<ReviewResource, Long> {
    @Query("DELETE FROM ReviewResource n WHERE n.review.rno = :rno")
    public void deleteByRno(Long rno);
    @Query("SELECT MAX(rr.rr_ord) FROM ReviewResource rr WHERE rr.review.rno = :rno")
    int getMaxOrd(Long rno);

}
