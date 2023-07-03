package com.X.X.repositories;

import com.X.X.domains.FileUpload;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface FileUploadRepository extends JpaRepository<FileUpload, UUID> {
    List <FileUpload> findByDropShippingProductId(UUID id);
}
