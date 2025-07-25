package com.example.zidio.repository;

import com.example.zidio.model.Job;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByCategoryIgnoreCase(String category);
}
