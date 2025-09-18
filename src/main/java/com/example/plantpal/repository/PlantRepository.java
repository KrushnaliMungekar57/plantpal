package com.example.plantpal.repository;

import com.example.plantpal.model.Plant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PlantRepository extends JpaRepository<Plant, Long> {
    // Find plant by exact name
    Optional<Plant> findByName(String name);
}
