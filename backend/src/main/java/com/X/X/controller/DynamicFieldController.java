package com.X.X.controller;

import com.X.X.domains.DynamicField;
import com.X.X.domains.FieldType;
import com.X.X.services.DynamicFieldService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
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
                FieldType fieldType = dynamicFieldService.mapFieldTypeDynamic(fieldValueMap.get("fieldType"));

                if (fieldValue != null && !fieldValue.isEmpty()) {
                    DynamicField dynamicField = new DynamicField();
                    dynamicField.setCustomFormId(customFormId);
                    dynamicField.setFieldName(fieldName);
                    dynamicField.setFieldValue(fieldValue);
                    dynamicField.setTableId(tableId); // Set the tableId
                    dynamicField.setFieldType(fieldType);

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
    @PutMapping("/{customFormId}")
    public ResponseEntity<?> editDynamicField(
            @PathVariable UUID customFormId,
            @RequestBody List<Map<String, String>> updatedFieldValues
    ) {
        try {
            // Group the updated field values by tableId
            Map<UUID, List<Map<String, String>>> groupedFieldValues = updatedFieldValues.stream()
                    .collect(Collectors.groupingBy(fieldValueMap -> UUID.fromString(fieldValueMap.get("tableId"))));

            // Update or Insert the fields for each tableId
            for (List<Map<String, String>> tableFieldValues : groupedFieldValues.values()) {
                for (Map<String, String> fieldValueMap : tableFieldValues) {
                    UUID tableId = UUID.fromString(fieldValueMap.get("tableId"));
                    String fieldName = fieldValueMap.get("fieldName");
                    String fieldValue = fieldValueMap.get("fieldValue");
                    FieldType fieldType = dynamicFieldService.mapFieldTypeDynamic(fieldValueMap.get("fieldType"));

                    // Fetch the existing dynamic field
                    Optional<DynamicField> existingFieldOpt = dynamicFieldService.findByTableIdAndFieldName(tableId, fieldName);

                    DynamicField dynamicField;
                    if (existingFieldOpt.isPresent()) {
                        dynamicField = existingFieldOpt.get();
                    } else {
                        // If the field doesn't exist, then initialize a new DynamicField object
                        dynamicField = new DynamicField();
                        dynamicField.setCustomFormId(customFormId);
                        dynamicField.setTableId(tableId);
                        dynamicField.setFieldName(fieldName);
                    }

                    // Update (or set, if new) the field value and field type
                    dynamicField.setFieldValue(fieldValue);
                    dynamicField.setFieldType(fieldType);

                    // Save (either updates or inserts)
                    dynamicFieldService.saveDynamicField(dynamicField);
                }
            }
        } catch (Exception ex) {
            return new ResponseEntity<>("Error occurred while updating or inserting dynamic field.", HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>(HttpStatus.OK);
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

    @CrossOrigin
    @GetMapping("/by-table-id/{tableId}")
    public ResponseEntity<List<DynamicField>> getDynamicFieldsByTableId(@PathVariable UUID tableId) {
        List<DynamicField> dynamicFields = dynamicFieldService.getDynamicFieldsByTableId(tableId);
        if (dynamicFields == null || dynamicFields.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(dynamicFields, HttpStatus.OK);
    }



    @CrossOrigin
    @GetMapping("/formName/{tableId}")
    public ResponseEntity<String> getFormNameByTableId(@PathVariable UUID tableId) {
        String formName = dynamicFieldService.getFormNameByTableId(tableId);

        if (formName == null || formName.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(formName, HttpStatus.OK);
    }





}

