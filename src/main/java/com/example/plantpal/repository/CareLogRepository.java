package com.example.plantpal.repository;

import com.example.plantpal.dto.CareLogDTO;
import com.example.plantpal.model.CareLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface CareLogRepository extends JpaRepository<CareLog, Long> {

    List<CareLog> findByDate(LocalDate date);

    @Query("SELECT new com.example.plantpal.dto.CareLogDTO(c.plant.name, c.date, c.notes) FROM CareLog c")
    List<CareLogDTO> findAllCareLogDTOs();
}
