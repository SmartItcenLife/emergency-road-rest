export function getMapHospitalLabels(category) {
    switch (category) {
        case "GENERAL":
            default :
            return {
                title : "응급실 병상 현황",
                availableLabel : "가용 병상",
                totalLabel : "전체 병상",
                ratioLabel : "가용률",
                summaryType: "rate",
                markerStatusType: "status",
                countSuffix: "개"
            };
        case "PREGNANT" :
            return {
                title : "분만 가능 여부",
                availableLabel : "가용 NICU 병상",
                totalLabel : "전체 NICU 병상",
                ratioLabel : "분만 상태",
                summaryType: "status",
                statusSummaryLabel: "분만 가능 여부",
                markerStatusType: "resourceRate",
                markerSummaryLabel: "NICU",
                countSuffix: "개"
            };
        case "PEDIATRIC" : 
            return {
                title : "소아 병상 현황",
                availableLabel : "가용 소아 병상",
                totalLabel : "전체 소아 병상",
                ratioLabel : "가용률",
                summaryType: "rate",
                markerStatusType: "status",
                countSuffix: "개"
            };
        }
    }
