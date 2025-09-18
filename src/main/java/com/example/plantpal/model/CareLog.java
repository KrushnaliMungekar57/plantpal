package com.example.plantpal.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "care_logs")
public class CareLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relationship to Plant entity
    @ManyToOne
    @JoinColumn(name = "plant_id", nullable = false) // Foreign key column
    private Plant plant;

    @Column(name = "task_type", nullable = false)
    private String taskType;

    @Column(name = "date", nullable = false)
    private LocalDate date;

    @Column(name = "notes")
    private String notes;

    



    public CareLog() {}

    public CareLog(Plant plant, String taskType, LocalDate date, String notes) {
        this.plant = plant;
        this.taskType = taskType;
        this.date = date;
        this.notes = notes;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Plant getPlant() { return plant; }
    public void setPlant(Plant plant) { this.plant = plant; }

    public String getTaskType() { return taskType; }
    public void setTaskType(String taskType) { this.taskType = taskType; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}

