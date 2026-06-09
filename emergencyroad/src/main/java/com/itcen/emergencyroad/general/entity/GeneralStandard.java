package com.itcen.emergencyroad.general.entity;

import com.itcen.emergencyroad.global.entity.BaseEntity;
import com.itcen.emergencyroad.hospital.entity.Hospital;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "general_standard")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class GeneralStandard extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // JPA에서 사용하는 기본키 ID

    //병원 ID (FK)
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hpid", nullable = false)
    private Hospital hospital;

    @Column(name = "er_total_beds")
    private Integer emergencyTotalBeds; // 응급실 일반 병상 전체 병상 수 --> 이게 맞음

    @Column(name = "icu_total_beds")
    private Integer icuTotalBeds; // 일반 중환자실 전체 병상 수

    @Column(name = "neuro_icu_total_beds")
    private Integer neuroIcuTotalBeds; // 신경과 중환자실 전체 병상 수

    @Column(name = "chest_icu_total_beds")
    private Integer chestIcuTotalBeds; // 흉부외과 중환자실 전체 병상 수

    // --- 응급실 장비 가용 여부 ---
    @Column(name = "ct_yn")
    private String ctAvailable; // CT 촬영 가능 여부

    @Column(name = "mri_yn")
    private String mriAvailable; // MRI 촬영 가능 여부

    @Column(name = "ventilator_yn")
    private String ventilatorAvailable; // 인공호흡기 사용 가능 여부

    @Column(name = "crrt_yn")
    private String crrtAvailable; // 지속적 신대체요법(CRRT) 가능 여부

    @Column(name = "ecmo_yn")
    private String ecmoAvailable; // ECMO 장비 사용 가능 여부

    @Column(name = "angio_yn")
    private String angioAvailable; // 혈관조영술 가능 여부

    @Column(name = "recorded_at")
    private LocalDateTime recordedAt; // hvidate 변환값

    public void updateGeneralStandardData(
            Integer emergencyTotalBeds,
            Integer icuTotalBeds,
            Integer neuroIcuTotalBeds,
            Integer chestIcuTotalBeds,
            String ctAvailable,
            String mriAvailable,
            String ventilatorAvailable,
            String crrtAvailable,
            String ecmoAvailable,
            String angioAvailable,
            LocalDateTime recordedAt
    ){
        this.emergencyTotalBeds = emergencyTotalBeds;
        this.icuTotalBeds= icuTotalBeds;
        this.neuroIcuTotalBeds = neuroIcuTotalBeds;
        this.chestIcuTotalBeds = chestIcuTotalBeds;
        this.ctAvailable = ctAvailable;
        this.mriAvailable = mriAvailable;
        this.ventilatorAvailable = ventilatorAvailable;
        this.crrtAvailable = crrtAvailable;
        this.ecmoAvailable = ecmoAvailable;
        this.angioAvailable = angioAvailable;
        this.recordedAt = recordedAt;
    }
}
