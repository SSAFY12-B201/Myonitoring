package com.myaicrosoft.myonitoring.controller;

import com.google.firebase.messaging.FirebaseMessagingException;
import com.myaicrosoft.myonitoring.model.dto.NotificationRequestDto;
import com.myaicrosoft.myonitoring.service.FCMService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController("/api")
public class NotificationController {
    @Autowired
    private FCMService fcmService;

    @PostMapping("/send-notification")
    public String sendNotification(@RequestBody NotificationRequestDto request) {
        try {
            fcmService.sendMessage(request.getToken(), request.getTitle(), request.getBody());
            return "Notification sent successfully";
        } catch (FirebaseMessagingException e) {
            return "Error sending notification: " + e.getMessage();
        }
    }
}
