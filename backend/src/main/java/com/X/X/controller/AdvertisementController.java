package com.X.X.controller;

import com.X.X.domains.Advertisement;
import com.X.X.repositories.UserRepository;
import com.X.X.services.AdvertisementService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/advertisements")
public class AdvertisementController {
    @Autowired
    private AdvertisementService advertisementService;
    @Autowired
    private UserRepository userRepository;

    @CrossOrigin
    @PostMapping("/{id}")
    @Operation(summary = "Create advertisement", description = "Create an advertisement for the specified user account.")
    public Advertisement createAdvertisement(@PathVariable UUID id, @RequestBody Advertisement advertisement) {
        advertisement.setAccountId(id);
        return advertisementService.saveAdvertisement(advertisement);
    }

    @CrossOrigin
    @Operation(summary = "Get advertisements", description = "Get all advertisements for the specified user account.")
    @GetMapping("/{accountId}")
    public List<Advertisement> getAdvertisement(@PathVariable UUID accountId) {
        return advertisementService.getAdvertisements(accountId);
    }

    @CrossOrigin
    @Operation(summary = "Get single advertisement", description = "Get the details of a single advertisement by ID.")
    @GetMapping("single/{id}")
    public Advertisement getSingleAdvertisement(@PathVariable UUID id) {
        return advertisementService.getSingleAdvertisement(id);
    }
}
