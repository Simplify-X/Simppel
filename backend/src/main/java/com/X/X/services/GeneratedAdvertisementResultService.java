package com.X.X.services;

import com.X.X.domains.GeneratedAdvertisementResult;
import com.X.X.domains.PostAutomation;
import com.X.X.repositories.GeneratedAdvertisementResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class GeneratedAdvertisementResultService {
    @Autowired
    GeneratedAdvertisementResultRepository generatedAdvertisementResultRepository;

    public GeneratedAdvertisementResult saveResult(GeneratedAdvertisementResult generatedAdvertisementResult) {
        GeneratedAdvertisementResult existingResult = generatedAdvertisementResultRepository.findByAdvertisementId(generatedAdvertisementResult.getAdvertisementId());

        if (existingResult != null) {
            // Update the existing record with the new data
            existingResult.setTitle(generatedAdvertisementResult.getTitle());
            existingResult.setDescription(generatedAdvertisementResult.getDescription());
            return generatedAdvertisementResultRepository.save(existingResult);
        } else {
            // Save a new record
            return generatedAdvertisementResultRepository.save(generatedAdvertisementResult);
        }
    }

    public GeneratedAdvertisementResult getResult(UUID advertisementId) {
        return generatedAdvertisementResultRepository.findByAdvertisementId(advertisementId);
    }
}

