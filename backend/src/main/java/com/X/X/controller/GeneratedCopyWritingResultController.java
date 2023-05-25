package com.X.X.controller;

import com.X.X.domains.GeneratedAdvertisementResult;
import com.X.X.domains.GeneratedCopyWritingResult;
import com.X.X.domains.PostAutomation;
import com.X.X.services.GeneratedAdvertisementResultService;
import com.X.X.services.GeneratedCopyWritingResultService;
import com.X.X.services.PostAutomationService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/copyWriting/result")

public class GeneratedCopyWritingResultController {
    @Autowired
    private GeneratedCopyWritingResultService generatedCopyWritingResultService;

    @CrossOrigin
    @PostMapping("/{id}/{copyWritingId}")
    public GeneratedCopyWritingResult createPostAutomation(@PathVariable UUID id, @PathVariable UUID copyWritingId, @RequestBody GeneratedCopyWritingResult generatedCopyWritingResult) {
        generatedCopyWritingResult.setAccountId(id);
        generatedCopyWritingResult.setCopyWritingId(copyWritingId);
        return generatedCopyWritingResultService.saveResult(generatedCopyWritingResult);
    }

    @CrossOrigin
    @Operation(summary = "Get advertisements", description = "Get all advertisements for the specified user account.")
    @GetMapping("/{copyWritingId}")
    public GeneratedCopyWritingResult getResult(@PathVariable UUID copyWritingId) {
        return generatedCopyWritingResultService.getResult(copyWritingId);
    }
}
