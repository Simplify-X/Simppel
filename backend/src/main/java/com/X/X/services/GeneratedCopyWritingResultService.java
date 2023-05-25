package com.X.X.services;

import com.X.X.domains.GeneratedAdvertisementResult;
import com.X.X.domains.GeneratedCopyWritingResult;
import com.X.X.domains.PostAutomation;
import com.X.X.repositories.GeneratedAdvertisementResultRepository;
import com.X.X.repositories.GeneratedCopyWritingResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class GeneratedCopyWritingResultService {
    @Autowired
    GeneratedCopyWritingResultRepository generatedCopyWritingResultRepository;

    public GeneratedCopyWritingResult saveResult(GeneratedCopyWritingResult generatedCopyWritingResult) {
        GeneratedCopyWritingResult existingResult = generatedCopyWritingResultRepository.findByCopyWritingId(generatedCopyWritingResult.getCopyWritingId());

        if (existingResult != null) {
            // Update the existing record with the new data
            existingResult.setTitle(generatedCopyWritingResult.getTitle());
            existingResult.setDescription(generatedCopyWritingResult.getDescription());
            return generatedCopyWritingResultRepository.save(existingResult);
        } else {
            // Save a new record
            return generatedCopyWritingResultRepository.save(generatedCopyWritingResult);
        }
    }

    public GeneratedCopyWritingResult getResult(UUID copyWritingId) {
        return generatedCopyWritingResultRepository.findByCopyWritingId(copyWritingId);
    }
}

