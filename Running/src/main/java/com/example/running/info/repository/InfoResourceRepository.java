package com.example.running.info.repository;

import com.example.running.info.domain.InfoResource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface InfoResourceRepository extends JpaRepository<InfoResource, Long> {
    @Query("DELETE FROM InfoResource n WHERE n.info.ino = :ino")
    public void deleteByIno(Long ino);
    @Query("SELECT MAX(ir.ir_ord) FROM InfoResource ir WHERE ir.info.ino = :ino")
    int getMaxOrd(Long ino);
}
