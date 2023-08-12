package com.X.X.services;


import com.X.X.domains.CustomForm;
import com.X.X.domains.DynamicField;
import com.X.X.domains.FieldType;
import com.X.X.dto.DynamicFieldsDTO;
import com.X.X.repositories.CustomFormRepository;
import com.X.X.repositories.DynamicFieldRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class DynamicFieldService {

    private final DynamicFieldRepository dynamicFieldRepository;

    @Autowired
    private CustomFormRepository customFormRepository; // Assuming you have a CustomFormRepository

    @Autowired
    public DynamicFieldService(DynamicFieldRepository dynamicFieldRepository) {
        this.dynamicFieldRepository = dynamicFieldRepository;
    }

    public DynamicField saveDynamicField(DynamicField dynamicField) {
        return dynamicFieldRepository.save(dynamicField);
    }

    public Optional<DynamicField> findByTableIdAndFieldName(UUID tableId, String name) {
        return dynamicFieldRepository.findByTableIdAndFieldName(tableId, name);
    }

    public List<List<DynamicField>> getDynamicFieldsByCustomFormId(UUID customFormId) {
        List<DynamicField> dynamicFields = dynamicFieldRepository.findByCustomFormId(customFormId);
        Map<UUID, List<DynamicField>> groupedFields = new HashMap<>();

        for (DynamicField dynamicField : dynamicFields) {
            UUID tableId = dynamicField.getTableId();
            List<DynamicField> groupedFieldList = groupedFields.getOrDefault(tableId, new ArrayList<>());
            groupedFieldList.add(dynamicField);
            groupedFields.put(tableId, groupedFieldList);
        }

        return new ArrayList<>(groupedFields.values());
    }

    public List<DynamicField> getDynamicFieldsByTableId(UUID tableId) {
        return dynamicFieldRepository.findByTableIdWithCustomFields(tableId);
    }

    public String getFormNameByTableId(UUID tableId) {
        DynamicField dynamicField = dynamicFieldRepository.findFirstByTableId(tableId); // Assuming you have this method
        if (dynamicField == null) {
            return null;
        }

        UUID customFormId = dynamicField.getCustomFormId();
        CustomForm customForm = customFormRepository.findById(customFormId).orElse(null);

        if (customForm == null) {
            return null;
        }

        return customForm.getFormName();
    }

    public FieldType mapFieldTypeDynamic(String frontendFieldType) {
        switch (frontendFieldType) {
            case "Radio":
                return FieldType.RADIO;
            case "TextField":  // Update the case to uppercase
                return FieldType.TEXT_FIELD;
            case "TextArea":
                return FieldType.TEXT_AREA;
            case "Image":
                return FieldType.IMAGE;
            case "Checkbox":
                return FieldType.CHECKBOX;
            case "Select":
                return FieldType.SELECT;
            case "AutoComplete":
                return FieldType.AUTO_COMPLETE;
            case "Tracker":
                return FieldType.TRACKER;
            default:
                throw new IllegalArgumentException("Invalid field type: " + frontendFieldType);
        }
    }


}

