package com.X.X.controller;

import com.X.X.domains.Advertisement;
import com.X.X.domains.LoginLog;
import com.X.X.domains.ProductTracker;
import com.X.X.repositories.LoginLogRepository;
import com.X.X.repositories.ProductTrackerRepository;
import com.X.X.repositories.UserRepository;
import com.X.X.services.AdvertisementService;
import com.X.X.services.ProductTrackerService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/login-logs")
public class LoginLogsController {
    @Autowired
    private LoginLogRepository loginLogRepository;


    @CrossOrigin
    @Operation(summary = "Get all logs", description = "This returns all the log in logs in the app")
    @GetMapping
    public List<LoginLog> getAllLoginLogs() {
        return loginLogRepository.findAll();
    }

}
