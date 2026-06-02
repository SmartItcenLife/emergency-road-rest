package com.itcen.emergencyroad.map.dto;

import java.time.LocalDateTime;

public interface MapAreaCongestionProjection {

    String getAddress();

    Integer getAvailableCount();

    Integer getTotalCount();

    LocalDateTime getRecordedAt();
}
