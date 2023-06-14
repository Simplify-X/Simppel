package com.X.X.controller;

import com.X.X.domains.Advertisement;
import com.X.X.domains.Notification;
import com.X.X.domains.ProductTracker;
import com.X.X.dto.ResponseStatus;
import com.X.X.repositories.NotificationRepository;
import com.X.X.repositories.ProductTrackerRepository;
import com.X.X.repositories.UserRepository;
import com.X.X.services.AdvertisementService;
import com.X.X.services.NotificationService;
import com.X.X.services.ProductTrackerService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/notifications")
public class NotificationController {
    @Autowired
    private NotificationService notificationService;
    @Autowired
    private NotificationRepository notificationRepository;

    @CrossOrigin
    @PostMapping
    @Operation(summary = "Add a notification", description = "Create and send notification to users")
    public ResponseStatus createNotification(@RequestBody Notification notification) {
        return notificationService.saveNotification(notification);
    }

    @CrossOrigin
    @Operation(summary = "Update a notification", description = "Update a notification based on ID")
    @PutMapping("/{id}")
    public ResponseStatus updateNotification(@PathVariable UUID id, @RequestBody Notification notification) {
        return notificationService.updateNotification(id, notification);
    }

    @CrossOrigin
    @Operation(summary = "Get all notifications", description = "Get and manage all notifications")
    @GetMapping
    public Iterable<Notification> getNotification() {
        return notificationService.getNotifications();
    }

    @CrossOrigin
    @Operation(summary = "Get all notifications", description = "Get and manage all notifications")
    @GetMapping("/{id}")
    public Notification getSingleNotification(@PathVariable UUID id) {
        return notificationService.getSingleNotification(id);
    }

    @CrossOrigin
    @Operation(summary = "Delete notification", description = "Delete notifications")
    @DeleteMapping("/delete/{id}")
    public ResponseStatus deleteProduct(@PathVariable UUID id) {
        return notificationService.deleteProduct(id);
    }
}
