package com.example.plantpal.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;


@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendEmail(String name, String fromEmail, String messageText) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo("rupalimungekar30@gmail.com"); // your destination email
        message.setSubject("New Message from " + name);
        message.setText("Name: " + name + "\nEmail: " + fromEmail + "\nMessage: " + messageText);
        message.setFrom(fromEmail);

        mailSender.send(message);
    }
}
