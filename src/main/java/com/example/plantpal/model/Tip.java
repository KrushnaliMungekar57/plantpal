package com.example.plantpal.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "tips")
@Data
public class Tip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String content;
    private String category; // "Eco", "Composting", etc.
}
