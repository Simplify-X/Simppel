package com.X.X.services;

import com.X.X.domains.*;
import com.X.X.dto.ResponseStatus;
import com.X.X.help.Status;
import com.X.X.repositories.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class NotificationService {
    @Autowired
    private NotificationRepository notificationRepository;

    public ResponseStatus saveNotification(Notification notification) {
        try {
            notificationRepository.save(notification);
            return new ResponseStatus(Status.OK, "Added");
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseStatus(Status.FAILED, "Failed to save notification");
        }
    }


    public Iterable<Notification> getNotifications() {
        return notificationRepository.findAll();
    }

    public Notification getSingleNotification(UUID id) {
        return notificationRepository.findByid(id);
    }

    public ResponseStatus deleteProduct(UUID id){
        try{
            Notification productTracker = notificationRepository.findByid(id);
            notificationRepository.delete(productTracker);

            return new ResponseStatus(Status.OK, "Notification deleted");
        }
        catch (Exception e) {
            e.printStackTrace();
            return new ResponseStatus(Status.FAILED, "Failed to delete notification");
        }



    }

    public ResponseStatus updateNotification(UUID id, Notification updatedNotification) {
        try {
            Optional<Notification> existingNotificationOptional = notificationRepository.findById(id);
            if (existingNotificationOptional.isPresent()) {
                Notification existingNotification = existingNotificationOptional.get();
                existingNotification.setTitle(updatedNotification.getTitle());
                existingNotification.setDescription(updatedNotification.getDescription());
                // Update other properties as needed

                notificationRepository.save(existingNotification);
                return new ResponseStatus(Status.OK, "Notification updated");
            } else {
                return new ResponseStatus(Status.FAILED, "Notification not found");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseStatus(Status.FAILED, "Failed to update notification");
        }
    }


}
