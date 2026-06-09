package com.itcen.emergencyroad.general.entity;

import com.itcen.emergencyroad.global.entity.BaseEntity;
import com.itcen.emergencyroad.hospital.entity.Hospital;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "general_mkioskty")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class GeneralMkioskty extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //병원 ID (FK)
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hpid", nullable = false)
    private Hospital hospital;

    @Column(name = "recorded_at")
    private LocalDateTime recordedAt;

    // --- 중증 질환 수용 여부 (일반) ---
    @Column(name = "mi_yn")
    private String MKioskTy1; // 심근경색

    @Column(name = "cerebral_infarction_yn")
    private String MKioskTy2; // 뇌경색

    @Column(name = "subarachnoid_hemorrhage_yn")
    private String MKioskTy3; // 거미막하 출혈

    @Column(name = "other_hemorrhage_yn")
    private String MKioskTy4; // 거미막하출혈 외

    @Column(name = "aortic_chest_yn")
    private String MKioskTy5; // 대동맥응급_흉부

    @Column(name = "aortic_abdomen_yn")
    private String MKioskTy6; // 대동맥응급_복부

    @Column(name = "dialysis_yn")
    private String MKioskTy23; // 응급투석

    @Column(name = "closed_ward_yn")
    private String MKioskTy24; // 폐쇄병동입원

    @Column(name = "endoscopy_gi_yn")
    private String MKioskTy11; // 응급 내시경-성인위장관

    @Column(name = "endoscopy_bronchial_yn")
    private String MKioskTy13; // 응급내시경-성인 기관지

    @Column(name = "severe_burns_yn")
    private String MKioskTy19; // 중증화상-전문치료

    @Column(name = "angio_adult_yn")
    private String MKioskTy26; // 영상의학혈관중재-성인

    public void updateGeneralMkiosktyData(
            String MKioskTy1,
            String MKioskTy2,
            String MKioskTy3,
            String MKioskTy4,
            String MKioskTy5,
            String MKioskTy6,
            String MKioskTy23,
            String MKioskTy24,
            String MKioskTy11,
            String MKioskTy13,
            String MKioskTy19,
            String MKioskTy26,
            LocalDateTime recordedAt
    ){
        this.MKioskTy1 = MKioskTy1;
        this.MKioskTy2 = MKioskTy2;
        this.MKioskTy3 = MKioskTy3;
        this.MKioskTy4 = MKioskTy4;
        this.MKioskTy5 = MKioskTy5;
        this.MKioskTy6 = MKioskTy6;
        this.MKioskTy23 = MKioskTy23;
        this.MKioskTy24 = MKioskTy24;
        this.MKioskTy11 = MKioskTy11;
        this.MKioskTy13 = MKioskTy13;
        this.MKioskTy19 = MKioskTy19;
        this.MKioskTy26 = MKioskTy26;
        this.recordedAt = recordedAt;
    }


}