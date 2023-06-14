package com.X.X.services;


import com.X.X.domains.DynamicField;
import com.X.X.repositories.DynamicFieldRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class DynamicFieldService {

    private final DynamicFieldRepository dynamicFieldRepository;

    @Autowired
    public DynamicFieldService(DynamicFieldRepository dynamicFieldRepository) {
        this.dynamicFieldRepository = dynamicFieldRepository;
    }

    public DynamicField saveDynamicField(DynamicField dynamicField) {
        return dynamicFieldRepository.save(dynamicField);
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

}

