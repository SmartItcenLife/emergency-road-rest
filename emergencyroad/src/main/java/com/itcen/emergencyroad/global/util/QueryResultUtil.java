package com.itcen.emergencyroad.global.util;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class QueryResultUtil {

  private QueryResultUtil() {}

  public static Map<Long, Long> toCountMap(List<Object[]> rows) {
    return rows.stream()
        .collect(Collectors.toMap(
            row -> (Long) row[0],
            row -> (Long) row[1]
        ));
  }
}
