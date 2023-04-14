package com.X.X.controller;

import com.X.X.domains.GeneratedAdvertisementResult;
import com.X.X.domains.PostAutomation;
import com.X.X.services.GeneratedAdvertisementResultService;
import com.X.X.services.PostAutomationService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/advertisement/result")

public class GeneratedAdvertisementResultController {
    @Autowired
    private GeneratedAdvertisementResultService generatedAdvertisementResultService;

    @CrossOrigin
    @PostMapping("/{id}/{advertisementId}")
    public GeneratedAdvertisementResult createPostAutomation(@PathVariable UUID id, @PathVariable UUID advertisementId, @RequestBody GeneratedAdvertisementResult generatedAdvertisementResult) {
        generatedAdvertisementResult.setAccountId(id);
        generatedAdvertisementResult.setAdvertisementId(advertisementId);
        return generatedAdvertisementResultService.saveResult(generatedAdvertisementResult);
    }

    @CrossOrigin
    @Operation(summary = "Get advertisements", description = "Get all advertisements for the specified user account.")
    @GetMapping("/{advertisementId}")
    public GeneratedAdvertisementResult getResult(@PathVariable UUID advertisementId) {
        return generatedAdvertisementResultService.getResult(advertisementId);
    }
}
