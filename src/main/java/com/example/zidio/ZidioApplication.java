package com.example.zidio;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;

@SpringBootApplication
public class ZidioApplication {

	@Value("${gmail.user}")
	private String gmailUser;

	@Value("${gmail.pass}")
	private String gmailPass;

	public static void main(String[] args) {
		SpringApplication.run(ZidioApplication.class, args);
	}

	@Bean
	public JavaMailSender getJavaMailSender(
			@Value("${gmail.user}") String gmailUser,
			@Value("${gmail.pass}") String gmailPass) {

		JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
		mailSender.setHost("smtp.gmail.com");
		mailSender.setPort(587);

		mailSender.setUsername(gmailUser);
		mailSender.setPassword(gmailPass);

		Properties props = mailSender.getJavaMailProperties();
		props.put("mail.transport.protocol", "smtp");
		props.put("mail.smtp.auth", "true");
		props.put("mail.smtp.starttls.enable", "true");
		props.put("mail.debug", "true");

		return mailSender;
	}

}

