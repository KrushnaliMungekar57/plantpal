package com.example.zidio.controller;
import java.util.HashMap;

import com.example.zidio.model.Application;
import com.example.zidio.repository.ApplicationRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ApplicationController {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private JavaMailSender mailSender;

    @Value("${gmail.user}")
    private String gmailUser;

    @Value("${admin.email}")
    private String adminEmail;

    @PostMapping("/apply")
    public Application apply(@RequestBody Application application) throws MessagingException {
        Application savedApp = applicationRepository.save(application);

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setFrom(gmailUser);
        helper.setTo(adminEmail);
        helper.setSubject("New Application for Job ID " + application.getJobId());

        helper.setText("New applicant: " + application.getName() +
                "\nEmail: " + application.getEmail() +
                "\nResume:\n" + application.getResume());

        mailSender.send(message);
        return savedApp;
    }

    @GetMapping("/applications")
    public List<Application> getAllApplications() {
        return applicationRepository.findAll();
    }

    @DeleteMapping("/applications/{id}")
    public Map<String, Object> deleteApplication(@PathVariable Long id) {
        applicationRepository.deleteById(id);
        return Map.of("success", true);
    }

    @PostMapping("/applications/confirm")
    public Map<String, Object> confirmApplication(@RequestBody Application application) throws MessagingException {
        Map<String, Object> response = new HashMap<>();
        Application app = applicationRepository.findById(application.getId()).orElse(null);

        if (app != null) {
            app.setStatus("Confirmed");
            applicationRepository.save(app);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setFrom(gmailUser);
            helper.setTo(application.getEmail());
            helper.setSubject("Application Confirmed");
            helper.setText("Dear Applicant,\n\nYour application has been confirmed by the admin.\n\nThank you.");
            mailSender.send(message);

            response.put("success", true);
            response.put("message", "Application confirmed and email sent.");
        } else {
            response.put("success", false);
            response.put("message", "Application not found.");
        }

        return response;
    }


    @PostMapping("/admin/login")
    public ResponseEntity<Map<String, Object>> adminLogin(@RequestBody Map<String, String> body) {
        String password = body.get("password");
        boolean success = "rozgaar1234".equals(password);
        return ResponseEntity.ok(Map.of("authenticated", success));
    }
}
