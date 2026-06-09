package com.itcen.emergencyroad.general.entity;

import com.itcen.emergencyroad.global.entity.BaseEntity;
import com.itcen.emergencyroad.hospital.entity.Hospital;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "general_realtime")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class GeneralRealtime extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // JPA에서 사용하는 기본키 ID

    //병원 ID (FK)
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hpid", nullable = false)
    private Hospital hospital;

    // --- 응급실 병상 정보 ---
    @Column(name = "er_available_beds")
    private Integer emergencyAvailableBeds; // 응급실 일반 병상 실시간 가용 병상 수

    // --- 중환자실 병상 정보 ---
    @Column(name = "icu_available_beds")
    private Integer icuAvailableBeds; // 일반 중환자실 실시간 가용 병상 수

    @Column(name = "neuro_icu_available_beds")
    private Integer neuroIcuAvailableBeds; // 신경과 중환자실 실시간 가용 병상 수

    @Column(name = "chest_icu_available_beds")
    private Integer chestIcuAvailableBeds; // 흉부외과 중환자실 실시간 가용 병상 수

    @Column(name = "recorded_at")
    private LocalDateTime recordedAt;

    public void updateGeneralRealtimeData(
            Integer emergencyAvailableBeds,
            Integer icuAvailableBeds,
            Integer neuroIcuAvailableBeds,
            Integer chestIcuAvailableBeds,
            LocalDateTime recordedAt
    ){
        this.emergencyAvailableBeds = emergencyAvailableBeds;
        this.icuAvailableBeds = icuAvailableBeds;
        this.neuroIcuAvailableBeds = neuroIcuAvailableBeds;
        this.chestIcuAvailableBeds = chestIcuAvailableBeds;
        this.recordedAt = recordedAt;
    }
}
