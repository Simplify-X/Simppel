package com.X.X.services;

import com.X.X.domains.FileUpload;
import com.X.X.repositories.FileUploadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class FileUploadService {
    private final FileUploadRepository fileUploadRepository;

    @Autowired
    public FileUploadService(FileUploadRepository fileUploadRepository) {
        this.fileUploadRepository = fileUploadRepository;
    }

    public FileUpload uploadFile(FileUpload fileUpload) {
        return fileUploadRepository.save(fileUpload);
    }

    public FileUpload getFileUploadById(UUID id) {
        return fileUploadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("File upload not found"));
    }

    public List<FileUpload> getImagesByDropShippingId(UUID dropShippingId) {
        return fileUploadRepository.findByDropShippingProductId(dropShippingId);
    }

}
