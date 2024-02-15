package com.X.X.controller;

import com.X.X.domains.*;
import com.X.X.dto.AITemplateDto;
import com.X.X.dto.QrCodeGeneratorDto;
import com.X.X.dto.ResponseStatus;
import com.X.X.repositories.AiTemplateRepository;
import com.X.X.repositories.NotificationRepository;
import com.X.X.repositories.ProductTrackerRepository;
import com.X.X.repositories.UserRepository;
import com.X.X.services.AdvertisementService;
import com.X.X.services.AiTemplateService;
import com.X.X.services.NotificationService;
import com.X.X.services.ProductTrackerService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/ai-template")
public class AiTemplateController {
    @Autowired
    private AiTemplateService aiTemplateService;
    @Autowired
    private AiTemplateRepository aiTemplateRepository;

    @CrossOrigin
    @PostMapping
    @Operation(summary = "Add a AI Template", description = "Create AI template for users")
    public ResponseStatus createNotification(@RequestBody AiTemplate aiTemplate) {
        return aiTemplateService.saveAiTemplate(aiTemplate);
    }

    @CrossOrigin
    @GetMapping("/admin")
    @Operation(summary = "Add a AI Template", description = "Create AI template for users")
    public Iterable<AiTemplate> getTemplates() {
        return aiTemplateRepository.findAll();
    }

    @CrossOrigin
    @Operation(summary = "Get single advertisement", description = "Get the details of a single advertisement by ID.")
    @PutMapping("/{id}")
    public AiTemplate updateQrCode(@PathVariable UUID id, @RequestBody AITemplateDto aiTemplateDto) {
        return aiTemplateService.updateAITemplate(id, aiTemplateDto);
    }

}
