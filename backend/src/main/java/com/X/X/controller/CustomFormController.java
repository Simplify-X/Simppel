package com.X.X.controller;


import com.X.X.domains.*;
import com.X.X.dto.ResponseStatus;
import com.X.X.services.CustomFormService;
import com.X.X.services.PostAutomationService;
import com.X.X.services.TeamGroupService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/customForm")
public class CustomFormController {

    @Autowired
    private CustomFormService customFormService;

    @CrossOrigin
    @GetMapping("/{accountId}")
    @Operation(summary = "Get Team Groups", description = "Get all team groups for the specified user account.")
    public List<CustomForm> getCustomForm(@PathVariable UUID accountId) {
        return customFormService.getCustomForm(accountId);
    }

    @CrossOrigin
    @PostMapping("/create/{id}")
    @Operation(summary = "Create Team Groups", description = "Create a Team Group for the specified user account.")
    public CustomForm createCustomForm(@PathVariable UUID id, @RequestBody CustomForm customForm) {
        customForm.setAccountId(id);

        customForm.setFormType(CustomFormType.fromString(String.valueOf(customForm.getFormType())));

        return customFormService.saveForm(customForm);
    }

    @CrossOrigin
    @PutMapping("/update/{id}/{accountId}")
    @Operation(summary = "Create Team Groups", description = "Create a Team Group for the specified user account.")
    public CustomForm editCustomForm(@PathVariable UUID id,@PathVariable UUID accountId,  @RequestBody CustomForm customForm) {
        customForm.setAccountId(accountId);
        return customFormService.updateCustomForm(customForm, id);
    }


    @CrossOrigin
    @GetMapping("/single/{id}")
    @Operation(summary = "Create Team Groups", description = "Create a Team Group for the specified user account.")
    public CustomForm getSingle(@PathVariable UUID id) {
        return customFormService.getSingleCustomForm(id);
    }

    @CrossOrigin
    @DeleteMapping("/delete/{id}")
    @Operation(summary = "Create Team Groups", description = "Create a Team Group for the specified user account.")
    public ResponseStatus deleteProduct(@PathVariable UUID id) {
        return customFormService.deleteProduct(id);
    }





}
