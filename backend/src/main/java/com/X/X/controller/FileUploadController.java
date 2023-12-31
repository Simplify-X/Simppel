package com.X.X.controller;

import com.X.X.domains.FileUpload;
import com.X.X.services.FileUploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/file-upload")
public class FileUploadController {
    private final FileUploadService fileUploadService;

    @Autowired
    public FileUploadController(FileUploadService fileUploadService) {
        this.fileUploadService = fileUploadService;
    }

    @CrossOrigin
    @PostMapping
    public ResponseEntity<List<UUID>> uploadFiles(@RequestParam("files") MultipartFile[] files,
                                                  @RequestParam("dropShippingProductId") UUID dropShippingProductId) {
        List<UUID> uploadedFileIds = new ArrayList<>();

        for (MultipartFile file : files) {
            try {
                // Read the file content as a byte array
                byte[] fileContent = file.getBytes();

                // Create a new FileUpload object and set the file name, file content, and dropShippingProductId
                FileUpload fileUpload = FileUpload.builder()
                        .fileName(file.getOriginalFilename())
                        .fileContent(fileContent)
                        .dropShippingProductId(dropShippingProductId)
                        .build();

                // Save the file upload object to the database
                FileUpload savedFileUpload = fileUploadService.uploadFile(fileUpload);

                // Add the saved file upload ID to the list
                uploadedFileIds.add(savedFileUpload.getId());
            } catch (Exception e) {
                // Handle the exception and return an error response if necessary
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
            }
        }

        return ResponseEntity.status(HttpStatus.OK).body(uploadedFileIds);
    }

    @CrossOrigin
    @GetMapping("/{id}")
    public ResponseEntity<FileUpload> getFileUpload(@PathVariable("id") UUID id) {
        FileUpload fileUpload = fileUploadService.getFileUploadById(id);
        return ResponseEntity.ok(fileUpload);
    }

    @GetMapping("/{dropShippingId}/images")
    public ResponseEntity<List<FileUpload>> getImagesByDropShippingId(@PathVariable("dropShippingId") UUID dropShippingId) {
        List<FileUpload> fileUploads = fileUploadService.getImagesByDropShippingId(dropShippingId);
        return ResponseEntity.ok(fileUploads);
    }

}
