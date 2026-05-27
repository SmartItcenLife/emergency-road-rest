export function getMarkerColorByGrade(grade) {
    switch (grade) {
        case "RELEXED":
            return "#16a34a"; // 초록색
        case "NORMAL":
            return "#2563eb"; // 파란색
        case "CROWDED":
            return "#f97316"; // 주황색
        case "VERY_CROWDED":
            return "#dc2626"; // 진한 빨간색
        case "UNKNOWN":
        default:
            return "#6b7280";   // 회색
    }
}