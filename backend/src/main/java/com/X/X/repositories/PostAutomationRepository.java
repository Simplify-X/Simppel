package com.X.X.repositories;

import com.X.X.domains.PostAutomation;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

public interface PostAutomationRepository extends CrudRepository<PostAutomation, UUID> {

    List<PostAutomation> findByUserId(UUID id);
    List<PostAutomation> findByAccountId(UUID accountId);

}



