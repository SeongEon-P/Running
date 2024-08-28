package com.example.running.teamincruit.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
@Table(name = "incruit_img", indexes = {
        @Index(name = "incruit_ino_idx", columnList = "ino")})
public class IncruitImg {

    @Id
    @Column(name = "incruit_uuid", length = 200)
    private String incruitUuid;

    @Column(name = "incruit_file_name", nullable = false, length = 200)
    private String incruitFileName;

    @Column(name = "incruit_ord", nullable = false)
    private int incruitOrd;

    @ManyToOne
    @JoinColumn(name = "ino", referencedColumnName = "ino", foreignKey = @ForeignKey(name = "incruit_ino_fk"), nullable = false)
    private Incruit incruit;

}
