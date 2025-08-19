package com.example.plantpal.controller;

import com.example.plantpal.dto.CareLogDTO;
import com.example.plantpal.model.CareLog;
import com.example.plantpal.model.Plant;
import com.example.plantpal.repository.PlantRepository;
import com.example.plantpal.service.CareLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/carelogs")
public class CareLogController {

    @Autowired
    private CareLogService careLogService;

    @Autowired
    private PlantRepository plantRepository;

    @GetMapping
    public List<CareLog> getAllCareLogs() {
        return careLogService.getAllCareLogs();
    }

    @GetMapping("/date/{date}")
    public List<CareLog> getCareLogsByDate(@PathVariable String date) {
        return careLogService.getCareLogsByDate(LocalDate.parse(date));
    }

    @PostMapping
    public CareLog saveCareLog(@RequestBody CareLogDTO dto) {
        Plant plant = plantRepository.findByName(dto.getPlantName())
                .orElseThrow(() -> new RuntimeException("Plant not found: " + dto.getPlantName()));

        CareLog careLog = new CareLog(
                plant,
                dto.getTaskType(), // From DTO instead of hardcoding
                dto.getCareDate(),
                dto.getNotes()
        );

        return careLogService.saveCareLog(careLog);
    }

    @GetMapping("/today")
    public List<CareLog> getTodayLogs() {
        return careLogService.getCareLogsByDate(LocalDate.now());
    }

    @GetMapping("/dto")
    public List<CareLogDTO> getAllCareLogDTOs() {
        return careLogService.getAllCareLogDTOs();
    }
}
