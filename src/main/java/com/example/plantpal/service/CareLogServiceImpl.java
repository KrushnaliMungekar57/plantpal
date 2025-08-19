// src/main/java/com/example/plantpal/service/CareLogServiceImpl.java
package com.example.plantpal.service;

import com.example.plantpal.dto.CareLogDTO;
import com.example.plantpal.model.CareLog;
import com.example.plantpal.repository.CareLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class CareLogServiceImpl implements CareLogService {

    @Autowired
    private CareLogRepository careLogRepository;

    @Override
    public List<CareLog> getAllCareLogs() {
        return careLogRepository.findAll();
    }

    @Override
    public List<CareLog> getCareLogsByDate(LocalDate date) {
        return careLogRepository.findByDate(date);
    }

    @Override
    public CareLog saveCareLog(CareLog careLog) {
        return careLogRepository.save(careLog);
    }

    @Override
    public List<CareLogDTO> getAllCareLogDTOs() {
        return careLogRepository.findAllCareLogDTOs();
    }
}
