package com.X.X.controller;


import com.X.X.domains.Advertisement;
import com.X.X.domains.PostAutomation;
import com.X.X.services.PostAutomationService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/posts")
public class PostAutomationController {

    @Autowired
    private PostAutomationService postAutomationService;

    @CrossOrigin
    @PostMapping("/{id}")
    @Operation(summary = "Create advertisement", description = "Create an advertisement for the specified user account.")
    public PostAutomation createPostAutomation(@PathVariable UUID id, @RequestBody PostAutomation postAutomation) {
        postAutomation.setAccountId(id);
        return postAutomationService.saveAdvertisement(postAutomation);
    }

    @CrossOrigin
    @Operation(summary = "Get advertisements", description = "Get all advertisements for the specified user account.")
    @GetMapping("/{accountId}")
    public List<PostAutomation> getAutomation(@PathVariable UUID accountId) {
        return postAutomationService.getAutomation(accountId);
    }

}
