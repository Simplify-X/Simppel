package com.X.X.repositories;

import com.X.X.domains.AiTemplate;
import com.X.X.domains.CopyWriting;
import com.X.X.domains.QrGenerator;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AiTemplateRepository extends CrudRepository<AiTemplate, UUID> {

    AiTemplate findByid(UUID id);

}
