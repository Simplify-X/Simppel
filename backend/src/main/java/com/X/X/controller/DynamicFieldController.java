package com.X.X.controller;

import com.X.X.domains.DynamicField;
import com.X.X.services.DynamicFieldService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/dynamic-fields")
public class DynamicFieldController {

    private final DynamicFieldService dynamicFieldService;

    @Autowired
    public DynamicFieldController(DynamicFieldService dynamicFieldService) {
        this.dynamicFieldService = dynamicFieldService;
    }

    @CrossOrigin
    @PostMapping("/{customFormId}")
    public ResponseEntity<?> createDynamicField(
            @PathVariable UUID customFormId,
            @RequestBody List<Map<String, String>> fieldValues
    ) {
        // Group the field values by tableId
        Map<UUID, List<Map<String, String>>> groupedFieldValues = fieldValues.stream()
                .collect(Collectors.groupingBy(fieldValueMap -> UUID.fromString(fieldValueMap.get("tableId"))));

        // Save the fields for each tableId
        for (List<Map<String, String>> tableFieldValues : groupedFieldValues.values()) {
            for (Map<String, String> fieldValueMap : tableFieldValues) {
                String fieldName = fieldValueMap.get("fieldName");
                String fieldValue = fieldValueMap.get("fieldValue");
                UUID tableId = UUID.fromString(fieldValueMap.get("tableId"));

                if (fieldValue != null && !fieldValue.isEmpty()) {
                    DynamicField dynamicField = new DynamicField();
                    dynamicField.setCustomFormId(customFormId);
                    dynamicField.setFieldName(fieldName);
                    dynamicField.setFieldValue(fieldValue);
                    dynamicField.setTableId(tableId); // Set the tableId

                    DynamicField savedDynamicField = dynamicFieldService.saveDynamicField(dynamicField);

                    if (savedDynamicField == null) {
                        return new ResponseEntity<>("Error occurred while saving dynamic field.", HttpStatus.INTERNAL_SERVER_ERROR);
                    }
                }
            }
        }

        return new ResponseEntity<>(HttpStatus.CREATED);
    }




    @CrossOrigin
    @GetMapping("/{customFormId}")
    public ResponseEntity<List<List<DynamicField>>> getDynamicFieldsByCustomFormId(@PathVariable UUID customFormId) {
        List<List<DynamicField>> groupedFields = dynamicFieldService.getDynamicFieldsByCustomFormId(customFormId);

        if (groupedFields.isEmpty()) {
            // Handle case when no dynamic fields are found for the specified customFormId
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(groupedFields, HttpStatus.OK);
    }



}

