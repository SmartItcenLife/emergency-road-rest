package com.itcen.emergencyroad.map.init;

import com.itcen.emergencyroad.map.entity.MapArea;
import com.itcen.emergencyroad.map.enums.MapAreaLevel;
import com.itcen.emergencyroad.map.repository.MapAreaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class MapAreaDataInitializer implements ApplicationRunner {
    private final MapAreaRepository mapAreaRepository;

    @Override
    public void run(ApplicationArguments args) {
        // 중복 방지를 위해 중복을 점검
        // 현재 서울시(11) 데이터만 넣을 것 이기 떄문에 아래와 같이 작성
        List<MapArea> existingAreas =
                mapAreaRepository.findActiveAreasBySidoAndLevel("11", MapAreaLevel.DISTRICT);

        if (!existingAreas.isEmpty()) {
            return;
        }

        mapAreaRepository.saveAll(createSeoulDistricts());
    }

    // GeoJson 의 SIG_CD 값을 기준으로 작성하였습니다.
    private List<MapArea> createSeoulDistricts() {
        return List.of(
                MapArea.createDistrict("11110", "종로구", 1),
                MapArea.createDistrict("11140", "중구", 2),
                MapArea.createDistrict("11170", "용산구", 3),
                MapArea.createDistrict("11200", "성동구", 4),
                MapArea.createDistrict("11215", "광진구", 5),
                MapArea.createDistrict("11230", "동대문구", 6),
                MapArea.createDistrict("11260", "중랑구", 7),
                MapArea.createDistrict("11290", "성북구", 8),
                MapArea.createDistrict("11305", "강북구", 9),
                MapArea.createDistrict("11320", "도봉구", 10),
                MapArea.createDistrict("11350", "노원구", 11),
                MapArea.createDistrict("11380", "은평구", 12),
                MapArea.createDistrict("11410", "서대문구", 13),
                MapArea.createDistrict("11440", "마포구", 14),
                MapArea.createDistrict("11470", "양천구", 15),
                MapArea.createDistrict("11500", "강서구", 16),
                MapArea.createDistrict("11530", "구로구", 17),
                MapArea.createDistrict("11545", "금천구", 18),
                MapArea.createDistrict("11560", "영등포구", 19),
                MapArea.createDistrict("11590", "동작구", 20),
                MapArea.createDistrict("11620", "관악구", 21),
                MapArea.createDistrict("11650", "서초구", 22),
                MapArea.createDistrict("11680", "강남구", 23),
                MapArea.createDistrict("11710", "송파구", 24),
                MapArea.createDistrict("11740", "강동구", 25)
        );
    }
}