package com.X.X.controller;

import com.X.X.domains.CustomFields;
import com.X.X.domains.CustomForm;
import com.X.X.domains.FieldType;
import com.X.X.services.CustomFieldsService;
import com.X.X.services.CustomFormService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/customFields")
public class CustomFieldsController {

    @Autowired
    private CustomFieldsService customFieldsService;

    @Autowired
    private CustomFormService customFormService;

    @CrossOrigin
    @PostMapping("/create/{customFormId}")
    public CustomFields createCustomFields(@PathVariable UUID customFormId, @RequestBody CustomFields customFields) {
        CustomForm customForm = customFormService.getSingleCustomForm(customFormId);
        customFields.setCustomForm(customForm);

        if (customFields.getFieldType() == FieldType.AUTO_COMPLETE) {
            List<String> autoCompleteValues = customFields.getAutoCompleteValues();
            customFields.setAutoCompleteValues(autoCompleteValues);
        }

        if (customFields.getFieldType() == FieldType.RADIO) {
            List<String> radioFieldValues = customFields.getRadioFieldValues();
            customFields.setRadioFieldValues(radioFieldValues);
        }

        // Convert the frontend representation to backend enum value
        String frontendFieldType = customFields.getFieldType().toString();
        FieldType backendFieldType = customFieldsService.mapFieldType(frontendFieldType);
        customFields.setFieldType(backendFieldType);

        return customFieldsService.saveCustomFields(customFields);
    }


    @CrossOrigin
    @GetMapping("/{customFormId}")
    public List<CustomFields> getCustomFieldsByCustomFormId(@PathVariable UUID customFormId) {
        return customFieldsService.getCustomFieldsByCustomFormId(customFormId);
    }

    @CrossOrigin
    @PutMapping("/update/{customFieldsId}")
    public CustomFields updateCustomFields(@PathVariable UUID customFieldsId, @RequestBody CustomFields updatedFields) {
        CustomFields existingFields = customFieldsService.getCustomFieldsById(customFieldsId);
        if (existingFields == null) {
            // Handle error, custom fields not found
            // For simplicity, you can throw an exception or return an appropriate response
        }

        if (existingFields.getFieldType() == FieldType.AUTO_COMPLETE) {
            List<String> autoCompleteValues = updatedFields.getAutoCompleteValues();
            existingFields.setAutoCompleteValues(autoCompleteValues);
        }

        if (existingFields.getFieldType() == FieldType.RADIO) {
            List<String> radioFieldValues = updatedFields.getRadioFieldValues();
            existingFields.setRadioFieldValues(radioFieldValues);
        }

        // Update the fields with the new values
        existingFields.setFieldName(updatedFields.getFieldName());
        existingFields.setFieldType(updatedFields.getFieldType());
        // Set other fields as needed

        // Save the updated custom fields
        return customFieldsService.saveCustomFields(existingFields);
    }



    // Add other endpoints as needed
}


