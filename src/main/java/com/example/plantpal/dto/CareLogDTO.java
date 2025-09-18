package com.example.plantpal.dto;

import java.time.LocalDate;

public class CareLogDTO {
    private String plantName;
    private String taskType;
    private LocalDate careDate;
    private String notes;

    // getters & setters
    public String getPlantName() { return plantName; }
    public void setPlantName(String plantName) { this.plantName = plantName; }

    public String getTaskType() { return taskType; }
    public void setTaskType(String taskType) { this.taskType = taskType; }

    public LocalDate getCareDate() { return careDate; }
    public void setCareDate(LocalDate careDate) { this.careDate = careDate; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
