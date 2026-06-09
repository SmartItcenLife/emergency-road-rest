package com.itcen.emergencyroad.external.scheduler;

import com.itcen.emergencyroad.external.RegionCode;
import com.itcen.emergencyroad.external.dto.EmrDto;
import com.itcen.emergencyroad.external.service.SrsillSyncService;
import com.itcen.emergencyroad.general.service.GeneralAllService;
import com.itcen.emergencyroad.pregnant.service.PregnantSyncService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(
        name = "scheduler.api.enabled",
        havingValue = "true"
)
public class GeneralMkiostySyncScheduler {
    private final SrsillSyncService srsillSyncService;
    private final GeneralAllService GeneralAllService;
    private final PregnantSyncService pregnantSyncService;


    //@Scheduled(fixedDelay = 180000)
    public void sync() {

        log.info("EMR API 가져오기 시작");

        for (String sido : RegionCode.MAP.keySet()) {

            //List<String> sigunguList = RegionCode.MAP.getOrDefault(sido, List.of());

            // for (String sigungu : sigunguList) {

            try {
                List<EmrDto> list = srsillSyncService.fetchAll(sido);
                pregnantSyncService.saveOrUpdate(list);
                GeneralAllService.saveOrUpdate(list);

                log.info("{} srsillSyncService 동기화 완료 size={}", sido, list.size());

                if (!list.isEmpty()) {
                    log.info("sample hpId={}", list.get(0).getHpid());
                }

            } catch (Exception e) {
                log.error("{} 동기화 실패", sido, e);
            }
        }
    }
}
