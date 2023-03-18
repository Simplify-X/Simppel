package com.X.X.controller;

import com.X.X.domains.Advertisement;
import com.X.X.domains.User;
import com.X.X.repositories.UserRepository;
import com.X.X.services.AdvertisementService;
import com.X.X.services.UserService;
import com.X.X.token.ValidTokenRequired;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
    public Advertisement createAdvertisement(@PathVariable UUID id, @RequestBody Advertisement advertisement) {
        advertisement.setAccountId(id);
        return advertisementService.saveAdvertisement(advertisement);
    }

    @CrossOrigin
    @GetMapping("/{accountId}")
    public List<Advertisement> getAdvertisement(@PathVariable UUID accountId) {
        return advertisementService.getAdvertisements(accountId);
    }

    @CrossOrigin
    @GetMapping("single/{id}")
    public Advertisement getSingleAdvertisement(@PathVariable long id) {
        return advertisementService.getSingleAdvertisement(id);
    }
}
