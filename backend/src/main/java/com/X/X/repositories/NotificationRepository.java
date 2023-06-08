package com.X.X.repositories;

import com.X.X.domains.Advertisement;
import com.X.X.domains.Notification;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;


@Repository
public interface NotificationRepository extends CrudRepository<Notification, UUID> {
    Notification findByid(UUID id);

}