package com.itcen.emergencyroad.recommend.entity;
import com.itcen.emergencyroad.global.entity.BaseEntity;
import com.itcen.emergencyroad.hospital.entity.Hospital;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * 스케줄러에 의해 80초마다 갱신되는 병원별 추천 점수 관리 엔티티
 * 사용자의 거리 데이터와 결합하여 최종 추천 순위를 결정
 */
@Entity
@Table(name = "hospital_score")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class HospitalScore extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hpid", referencedColumnName = "hpid", unique = true, nullable = false)
    private Hospital hospital;
    // 그룹화된 정보
    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "nicuAvailable", column = @Column(name = "nicu_available")),
            @AttributeOverride(name = "deliveryAvailable", column = @Column(name = "delivery_available")),
            @AttributeOverride(name = "obstetricSurgeryAvailable", column = @Column(name = "obstetric_surgery_available")),
            @AttributeOverride(name = "gynecologySurgeryAvailable", column = @Column(name = "gynecology_surgery_available")),
            @AttributeOverride(name = "emergencyDialysisAvailable", column = @Column(name = "emergency_dialysis_available")),
            @AttributeOverride(name = "isDeliveryRoomAvailable", column = @Column(name = "is_delivery_room_available")),
            @AttributeOverride(name = "nicuBedCount", column = @Column(name = "nicu_bed_count")),
            @AttributeOverride(name = "incubatorAvailableP", column = @Column(name = "incubator_available_p")),
            @AttributeOverride(name = "prematureVentilatorAvailable", column = @Column(name = "premature_ventilator_available")),
            @AttributeOverride(name = "deliveryRoomStandard", column = @Column(name = "delivery_room_standard")),
            @AttributeOverride(name = "nicuStandard", column = @Column(name = "nicu_standard")),
            @AttributeOverride(name = "ventilatorStandard", column = @Column(name = "ventilator_standard")),
            @AttributeOverride(name = "incubatorStandard", column = @Column(name = "incubator_standard"))
    })
    private PregnantInfo pregnantInfo;
    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "pediatricBedCount", column = @Column(name = "pediatric_bed_count")),
            @AttributeOverride(name = "pediatricBedStandard", column = @Column(name = "pediatric_bed_standard")),
            @AttributeOverride(name = "incubatorAvailable", column = @Column(name = "incubator_available"))
    })
    private PediatricInfo pediatricInfo;
    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "availableBeds", column = @Column(name = "available_beds")),
            @AttributeOverride(name = "totalBeds", column = @Column(name = "total_beds"))
    })
    private GeneralInfo generalInfo;

    @Column(name = "recorded_at")
    private LocalDateTime recordedAt;

    // --- 카테고리별 추천 점수 (0.0 ~ 100.0) ---
    @Builder.Default
    @Column(name = "pregnant_score")
    private Double pregnantScore = 0.0; // 임산부 응급 점수 (분만실, 산과수술 등 반영)

    @Builder.Default
    @Column(name = "pediatric_score")
    private Double pediatricScore = 0.0; // 소아 응급 점수 (소아과 전문의, NICU 등 반영)

    @Builder.Default
    @Column(name = "general_score")
    private Double generalScore = 0.0;   // 일반 응급 점수 (가용 병상, 응급실 가동률 반영)

    @Column(name = "pregnant_tag", length = 1000)
    private String pregnantTags; // 예: "분만 가능 | NICU 보유"

    @Column(name = "pediatric_tag", length = 1000)
    private String pediatricTags; // 예: "소아 전문의 상주"

    @Column(name = "general_tag", length = 1000)
    private String generalTags;   // 예: "응급실 여유"

    // --- 데이터 신뢰도 관리 ---

    @Column(name = "last_calculated_at")
    private LocalDateTime lastCalculatedAt; // 마지막으로 점수가 계산된 시각


    /**
     * 임산부 점수 및 태그 업데이트 로직
     */
    public void updatePregnantScore(Double score, String tag, PregnantInfo info) {
        this.pregnantScore = score;
        this.pregnantTags = tag;
        this.pregnantInfo = info;
        this.lastCalculatedAt = LocalDateTime.now();
    }

    /**
     * 소아 점수 및 태그 업데이트 로직
     */
    public void updatePediatricScore(Double score, String tag, PediatricInfo info, LocalDateTime recordedAt) {
        this.pediatricScore = score;
        this.pediatricTags = tag;
        this.pediatricInfo = info;
        this.recordedAt = recordedAt;
        this.lastCalculatedAt = LocalDateTime.now();
    }

    /**
     * 일반 응급 점수 및 태그 업데이트 로직
     */
    public void updateGeneralScore(Double score, String tag, GeneralInfo info, LocalDateTime recordedAt) {
        this.generalScore = score;
        this.generalTags = tag;
        this.generalInfo = info;
        this.recordedAt = recordedAt;
        this.lastCalculatedAt = LocalDateTime.now();
    }
}