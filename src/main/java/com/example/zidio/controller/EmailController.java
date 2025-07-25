package com.example.zidio.controller;

import com.example.zidio.model.ContactForm;
import com.example.zidio.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/email")
@CrossOrigin(origins = "*")
public class EmailController {

    @Autowired
    private EmailService emailService;

    @PostMapping("/send")
    public String sendEmail(@ModelAttribute ContactForm form) {
        emailService.sendEmail(form.getName(), form.getEmail(), form.getMessage());
        return "Message sent successfully!";
    }
}
