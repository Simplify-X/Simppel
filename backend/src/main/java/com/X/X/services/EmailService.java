package com.X.X.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendMail(String to, String subject, String body) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(body, true);
        mailSender.send(message);
    }

    public void sendPasswordResetEmail(String recipientEmail, String resetLink, String username) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(recipientEmail);
            helper.setSubject("Password reset request");

//            String text = "<html><body>" +
//                    "<p>Dear user,</p>" +
//                    "<p>Please use the following link to reset your password:</p>" +
//                    "<p><a href=\"" + resetLink + "\">" + resetLink + "</a></p>" +
//                    "<p>This link will expire in 2 hours.</p>" +
//                    "<p>Best regards,</p>" +
//                    "<p>Your application team</p>" +
//                    "</body></html>";

            // Load the HTML template from the file
            String html = new String(Files.readAllBytes(Paths.get("src/main/resources/templates/password_reset.html")));

            // Replace the resetLink placeholder with the actual reset link
            html = html.replace("${resetLink}", resetLink);
            html = html.replace("${username}", username);

            helper.setText(html, true);
            mailSender.send(message);
        } catch (MessagingException | IOException e) {
            // handle the exception
            e.printStackTrace();
        }
    }
}
