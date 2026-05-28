// features/hospitals/constants/categoryConfig.js

export const categoryConfig = {
  GENERAL: {
    title: '일반 응급 추천 결과',

    sectionTitle: '추천 병원 TOP 3',

    description: `
      현재 위치로부터 10km 이내,
      진료 가능 여부와 실시간 상황을
      종합 분석한 추천 결과입니다.
    `,

    highlightText: '진료 가능 여부와 실시간 상황',

    emptyMessage: `
      10km 반경 내에 추천 가능한 병원이 없습니다.
      아래 버튼을 눌러 전체 병원 목록을 확인해보세요.
    `,
    allHospitalLink: '/general/hospitals',

    allHospitalButtonText: '전체 병원 보기',

    donut: {
      countKey: 'availableEmergencyBedCount',
      totalKey: 'totalEmergencyBedCount',
      label: '응급실 병상',
    },
    theme: {
        primary: '#16a34a',
        light: '#f0fdf4',
        border: '#bbf7d0',
        soft: '#dcfce7',
        iconBg: '#dcfce7',
        iconColor: '#15803d',
        badgeBg: '#16a34a',
    },
    detailSections: [
      {
        title: '기본 정보',

        type: 'rows',

        items: [
          {
            label: '주소',
            key: 'address',
          },
          {
            label: '응급실 번호',
            key: 'emergencyPhone',
          },
          {
            label: '대표전화',
            key: 'phone',
          },
        ],
      },

      {
        title: '응급실 병상',

        type: 'resources',

        items: [
          {
            label: '응급실 병상',
            currentKey: 'emergencyAvailableBeds',
            totalKey: 'emergencyTotalBeds',
          },
        ],
      },

      {
        title: '중환자실 자원',

        type: 'resources',

        items: [
          {
            label: '일반 ICU',
            currentKey: 'icuAvailableBeds',
            totalKey: 'icuTotalBeds',
          },

          {
            label: '신경과 ICU',
            currentKey: 'neuroIcuAvailableBeds',
            totalKey: 'neuroIcuTotalBeds',
          },

          {
            label: '흉부외과 ICU',
            currentKey: 'chestIcuAvailableBeds',
            totalKey: 'chestIcuTotalBeds',
          },
        ],
      },

      {
        title: '장비 가능 여부',

        type: 'capabilities',

        items: [
          {
            label: 'CT',
            key: 'ctAvailable',
          },

          {
            label: 'MRI',
            key: 'mriAvailable',
          },

          {
            label: '인공호흡기',
            key: 'ventilatorAvailable',
          },

          {
            label: 'CRRT',
            key: 'crrtAvailable',
          },

          {
            label: 'ECMO',
            key: 'ecmoAvailable',
          },

          {
            label: '혈관조영',
            key: 'angioAvailable',
          },
        ],
      },

      {
        title: '중증질환 수용 가능',

        type: 'capabilities',

        items: [
          {
            label: '심근경색',
            key: 'myocardialInfarctionAvailable',
          },

          {
            label: '뇌경색',
            key: 'cerebralInfarctionAvailable',
          },

          {
            label: '거미막하 출혈',
            key: 'subarachnoidHemorrhageAvailable',
          },

          {
            label: '기타 출혈',
            key: 'otherHemorrhageAvailable',
          },

          {
            label: '대동맥 응급 흉부',
            key: 'aorticChestAvailable',
          },

          {
            label: '대동맥 응급 복부',
            key: 'aorticAbdomenAvailable',
          },

          {
            label: '응급투석',
            key: 'dialysisAvailable',
          },

          {
            label: '폐쇄병동 입원',
            key: 'closedWardAvailable',
          },

          {
            label: '응급내시경 위장관',
            key: 'endoscopyGiAvailable',
          },

          {
            label: '응급내시경 기관지',
            key: 'endoscopyBronchialAvailable',
          },

          {
            label: '중증화상',
            key: 'severeBurnsAvailable',
          },

          {
            label: '성인 혈관중재',
            key: 'angioAdultAvailable',
          },
        ],
      },

      {
        title: '갱신 시간',

        type: 'rows',

        items: [
          {
            label: '실시간 정보',
            key: 'realtimeRecordedAt',
            format: 'datetime',
          },
        ],
      },
    ],
  },

  PEDIATRIC: {
    title: '소아 응급 추천 결과',

    sectionTitle: '추천 병원 TOP 3',

    description: `
      현재 위치로부터 10km 이내,
      소아 진료 가능 여부와 실시간 상황을
      종합 분석한 추천 결과입니다.
    `,

    highlightText: '소아 진료 가능 여부와 실시간 상황',

    emptyMessage: `
      10km 반경 내에 추천 가능한 병원이 없습니다.
      아래 버튼을 눌러 전체 병원 목록을 확인해보세요.
    `,

    allHospitalLink: '/pediatric/hospitals',

    allHospitalButtonText: '전체 병원 보기',

    donut: {
      countKey: 'availablePediatricBedCount',
      totalKey: 'totalPediatricBedCount',
      label: '소아 병상',
    },
    theme: {
        primary: '#2563eb',
        light: '#eff6ff',
        border: '#dbeafe',
        soft: '#f0f9ff',
        iconBg: '#e0f2fe',
        iconColor: '#0284c7',
    },
    detailSections: [
      {
        title: '기본 정보',

        type: 'rows',

        items: [
          {
            label: '주소',
            key: 'address',
          },

          {
            label: '응급실 번호',
            key: 'emergencyPhone',
          },

          {
            label: '대표전화',
            key: 'phone',
          },

          {
            label: '소아 당직 연락처',
            key: 'pediatricHotline',
          },
        ],
      },

      {
        title: '소아 핵심 자원',

        type: 'resources',

        items: [
          {
            label: '소아 중환자실',
            currentKey: 'pediatricIcuCount',
            totalKey: 'pediatricIcuStandard',
          },

          {
            label: '응급 소아 ICU',
            currentKey: 'pediatricEmergencyIcuCount',
            totalKey: 'pediatricEmergencyIcuStandard',
          },

          {
            label: '응급 소아 입원',
            currentKey: 'pediatricEmergencyAdmissionCount',
            totalKey: 'pediatricEmergencyAdmissionStandard',
          },

          {
            label: '소아 음압격리',
            currentKey: 'pediatricNegativeIsolationCount',
            totalKey: 'pediatricNegativeIsolationStandard',
          },

          {
            label: '소아 일반격리',
            currentKey: 'pediatricGeneralIsolationCount',
            totalKey: 'pediatricGeneralIsolationStandard',
          },
        ],
      },

      {
        title: '장비 가능 여부',

        type: 'capabilities',

        items: [
          {
            label: '소아 인공호흡기',
            key: 'pediatricVentiAvailable',
          },

          {
            label: '조산아 인공호흡기',
            key: 'preemieVentiAvailable',
          },

          {
            label: '인큐베이터',
            key: 'incubatorAvailable',
          },

          {
            label: '인큐베이터 자원',
            key: 'incubatorResourceAvailable',
          },
        ],
      },

      {
        title: '소아 중증 수용 가능',

        type: 'capabilities',

        items: [
          {
            label: '장중첩/폐색 영유아',
            key: 'pediatricBowelObstructionAvailable',
          },

          {
            label: '응급내시경 위장관',
            key: 'pediatricEmergencyEndoscopyGastroAvailable',
          },

          {
            label: '응급내시경 기관지',
            key: 'pediatricEmergencyEndoscopyBronchialAvailable',
          },

          {
            label: '저체중출생아',
            key: 'lowBirthWeightInfantAvailable',
          },

          {
            label: '영상의학 혈관중재',
            key: 'pediatricVascularInterventionAvailable',
          },
        ],
      },

      {
        title: '갱신 시간',

        type: 'rows',

        items: [
          {
            label: '실시간 정보',
            key: 'realtimeRecordedAt',
            format: 'datetime',
          },

          {
            label: '기준 정보',
            key: 'standardRecordedAt',
            format: 'datetime',
          },
        ],
      },
    ],
  },

  PREGNANT: {
    title: '임산부 응급 추천 결과',

    sectionTitle: '추천 병원 TOP 3',

    description: `
      현재 위치로부터 10km 이내,
      분만 가능 여부와 실시간 상황을
      종합 분석한 추천 결과입니다.
    `,

    highlightText: '분만 가능 여부와 실시간 상황',

    emptyMessage: `
      10km 반경 내에 추천 가능한 병원이 없습니다.
      아래 버튼을 눌러 전체 병원 목록을 확인해보세요.
    `,

    allHospitalLink: '/pregnant/hospitals',

    allHospitalButtonText: '전체 병원 보기',

    donut: {
        countKey: 'nicuBedCount',
        totalKey: 'nicuStandard',
        label: 'NICU 병상',

        // 임산부는 병상 퍼센트보다
        // "분만 가능 여부" 자체가 핵심이라 커스텀 추가
        mode: 'delivery',

        availableKey: 'deliveryAvailable',

        availableText: '가능',
        unavailableText: '불가',

        availableColor: '#db2777',
        unavailableColor: '#fda4af',

        backgroundColor: '#fce7f3',
    },
    theme: {
        primary: '#db2777',
        light: '#fdf2f8',
        border: '#fbcfe8',
        soft: '#fff1f7',
        iconBg: '#fdf2f8',
        iconColor: '#db2777',
    },
    detailSections: [
      {
        title: '기본 정보',

        type: 'rows',

        items: [
          {
            label: '주소',
            key: 'address',
          },

          {
            label: '응급실 번호',
            key: 'emergencyPhone',
          },

          {
            label: '대표전화',
            key: 'phone',
          },
        ],
      },

      {
        title: '실시간 임산부 자원',

        type: 'resources',

        items: [
          {
            label: 'NICU 병상',
            currentKey: 'nicuBedCount',
            totalKey: 'nicuStandard',
          },

          {
            label: '인큐베이터',
            currentKey: 'incubatorCount',
            totalKey: 'incubatorStandard',
          },
        ],
      },

      {
        title: '진료 가능 여부',

        type: 'capabilities',

        items: [
          {
            label: '분만실 사용',
            key: 'isDeliveryRoomAvailable',
          },

          {
            label: '인큐베이터 사용',
            key: 'incubatorAvailable',
          },

          {
            label: '조산아 인공호흡기',
            key: 'prematureVentilatorAvailable',
          },

          {
            label: 'NICU 치료',
            key: 'nicuAvailable',
          },

          {
            label: '응급 분만',
            key: 'deliveryAvailable',
          },

          {
            label: '산과 수술',
            key: 'obstetricSurgeryAvailable',
          },

          {
            label: '부인과 수술',
            key: 'gynecologySurgeryAvailable',
          },

          {
            label: '응급 투석',
            key: 'emergencyDialysisAvailable',
          },
        ],
      },

      {
        title: '갱신 시간',

        type: 'rows',

        items: [
          {
            label: '실시간 정보',
            key: 'realtimeRecordedAt',
            format: 'datetime',
          },

          {
            label: '기준 정보',
            key: 'standardRecordedAt',
            format: 'datetime',
          },
        ],
      },
    ],
  },
};