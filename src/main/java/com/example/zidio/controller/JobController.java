package com.example.zidio.controller;

import com.example.zidio.model.Job;
import com.example.zidio.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "*")
public class JobController {

    @Autowired
    private JobRepository jobRepository;

    // ✅ Get all jobs
    @GetMapping
    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    // ✅ Create a new job
    @PostMapping
    public ResponseEntity<Map<String, Object>> createJob(@RequestBody Job job) {
        Job saved = jobRepository.save(job);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "jobId", saved.getId()
        ));
    }

    // ✅ Get job by ID
    @GetMapping("/{id}")
    public Job getJobById(@PathVariable Long id) {
        return jobRepository.findById(id).orElse(null);
    }
    @GetMapping("/category")
    public ResponseEntity<Map<String, Object>> getJobsByCategory(@RequestParam("category") String category) {
        System.out.println("Category received: " + category);  // Debug log

        List<Job> jobs = jobRepository.findByCategoryIgnoreCase(category);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "jobs", jobs
        ));
    }

}
