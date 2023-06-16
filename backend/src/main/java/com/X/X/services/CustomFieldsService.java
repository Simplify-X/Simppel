package com.X.X.services;

import com.X.X.domains.CustomFields;
import com.X.X.domains.FieldType;
import com.X.X.repositories.CustomFieldsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class CustomFieldsService {
    @Autowired
    private CustomFieldsRepository customFieldsRepository;

    public CustomFields saveCustomFields(CustomFields customFields) {
        return customFieldsRepository.save(customFields);
    }

    public List<CustomFields> getCustomFieldsByCustomFormId(UUID customFormId) {
        return customFieldsRepository.findByCustomFormId(customFormId);
    }

    public FieldType mapFieldType(String frontendFieldType) {
        String uppercaseFieldType = frontendFieldType.toUpperCase();
        switch (uppercaseFieldType) {
            case "RADIO":
                return FieldType.RADIO;
            case "TEXT_FIELD":  // Update the case to uppercase
                return FieldType.TEXT_FIELD;
            case "TEXT_AREA":
                return FieldType.TEXT_AREA;
            case "IMAGE":
                return FieldType.IMAGE;
            case "CHECKBOX":
                return FieldType.CHECKBOX;
            case "SELECT":
                return FieldType.SELECT;
            case "AUTO_COMPLETE":
                return FieldType.AUTO_COMPLETE;
            case "TRACKER":
                return FieldType.TRACKER;
            default:
                throw new IllegalArgumentException("Invalid field type: " + frontendFieldType);
        }
    }

    public CustomFields getCustomFieldsById(UUID customFieldsId) {
        Optional<CustomFields> customFields = customFieldsRepository.findById(customFieldsId);
        return customFields.orElse(null);
    }



    // Add other methods as needed
}
