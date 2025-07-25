package com.example.zidio.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "jobs") // 👈 specify the correct table name
@Data
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private String type;
    private String salary;
    private String deadline;

    @Column(name = "company_name")
    private String companyName;

    @Column(name = "company_logo")
    private String companyLogo;

    private String location;
    private String category;
}

