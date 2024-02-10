package com.X.X.controller;

import com.X.X.domains.QrGenerator;
import com.X.X.dto.QrCodeGeneratorDto;
import com.X.X.repositories.UserRepository;
import com.X.X.services.QrGeneratorService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/qr-code")
public class QrGeneratorController {
    @Autowired
    private QrGeneratorService qrGeneratorService;
    @Autowired
    private UserRepository userRepository;

    @CrossOrigin
    @PostMapping("/{id}")
    @Operation(summary = "Create advertisement", description = "Create an advertisement for the specified user account.")
    public QrGenerator createAdvertisement(@PathVariable UUID id, @RequestBody QrGenerator qrGenerator) {
        qrGenerator.setAccountId(id);
        return qrGeneratorService.saveQrGenerator(qrGenerator);
    }

    @CrossOrigin
    @Operation(summary = "Get advertisements", description = "Get all advertisements for the specified user account.")
    @GetMapping("/{accountId}")
    public List<QrGenerator> getAdvertisement(@PathVariable UUID accountId) {
        return qrGeneratorService.getQrGenerator(accountId);
    }

    @CrossOrigin
    @Operation(summary = "Get single advertisement", description = "Get the details of a single advertisement by ID.")
    @GetMapping("single/{id}")
    public QrGenerator getSingleAdvertisement(@PathVariable UUID id) {
        return qrGeneratorService.getSingleQrRecord(id);
    }

    @CrossOrigin
    @Operation(summary = "Get single advertisement", description = "Get the details of a single advertisement by ID.")
    @PutMapping("/{id}")
    public QrGenerator updateQrCode(@PathVariable UUID id, @RequestBody QrCodeGeneratorDto qrCodeGenerator) {
        return qrGeneratorService.updateQrCode(id, qrCodeGenerator);
    }
}
