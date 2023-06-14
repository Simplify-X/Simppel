package com.X.X.repositories;

import com.X.X.domains.CustomForm;
import com.X.X.domains.PostAutomation;
import com.X.X.domains.TeamGroup;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface CustomFormRepository extends CrudRepository<CustomForm, UUID> {
    List<CustomForm> findAll();
    @Query("SELECT tg FROM CustomForm tg WHERE tg.id = :id")
    CustomForm findByGroupId(@Param("id") UUID id);
    List<CustomForm> findByAccountId(UUID accountId);
}
