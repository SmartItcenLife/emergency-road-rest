package com.itcen.emergencyroad.map.service;

import org.springframework.stereotype.Component;

@Component
public class MapDistrictResolver {

    // TODO : 전국 확장 시 hospital_master.area_code 또는 hospital_area_mapping 기준으로 변경한다.
    public String extractDistrictName(String address) {
        if (address == null || address.isBlank()) {
            return null;
        }

        String[] tokens = address.split(" ");

        for (String token : tokens) {
            if (token.endsWith("구")) {
                return token;
            }
        }

        return null;
    }
}
