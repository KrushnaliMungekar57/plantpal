// src/main/java/com/example/plantpal/service/CareLogService.java
package com.example.plantpal.service;

import com.example.plantpal.model.CareLog;
import com.example.plantpal.dto.CareLogDTO;
import java.time.LocalDate;
import java.util.List;

public interface CareLogService {
    List<CareLog> getAllCareLogs();
    List<CareLog> getCareLogsByDate(LocalDate date);
    CareLog saveCareLog(CareLog careLog);
    List<CareLogDTO> getAllCareLogDTOs();
}
