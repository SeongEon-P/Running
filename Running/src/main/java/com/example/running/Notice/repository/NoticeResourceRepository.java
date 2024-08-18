package com.example.running.Notice.repository;

import com.example.running.Notice.domain.NoticeResource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface NoticeResourceRepository extends JpaRepository<NoticeResource, Long> {
    @Query("DELETE FROM NoticeResource n WHERE n.notice.nno = :nno")
    public void deleteByNno(Long nno);
    @Query("SELECT MAX(nr.nr_ord) FROM NoticeResource nr WHERE nr.notice.nno = :nno")
    int getMaxOrd(Long nno);

}
