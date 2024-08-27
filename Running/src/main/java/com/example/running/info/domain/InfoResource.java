package com.example.running.info.domain;

import com.example.running.Notice.domain.Notice;
import com.example.running.Notice.domain.NoticeResource;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString(exclude = "info")
public class InfoResource implements Comparable<InfoResource> {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long irno;
    private String ir_name;
    private String ir_path;
    private String ir_type;
    private Long file_size;
    private int ir_ord;

    @Override
    public int compareTo(InfoResource o) {
        return this.ir_ord - o.ir_ord;
    }
    @ManyToOne
    @JoinColumn(name = "ino", referencedColumnName = "ino")
    private Info info;
}
