package com.example.plantpal.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class TipController {

    @GetMapping("/tips")
    public String showTipsPage() {
        return "tips"; // maps to tips.html in src/main/resources/templates/
    }
}
