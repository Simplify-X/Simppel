package com.X.X.repositories;

import com.X.X.domains.PostAutomation;
import com.X.X.domains.TeamGroup;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface TeamGroupRepository extends CrudRepository<TeamGroup, UUID> {
    List<TeamGroup> findAll();
    @Query("SELECT tg FROM TeamGroup tg WHERE tg.id = :id")
    TeamGroup findByGroupId(@Param("id") UUID id);
    List<TeamGroup> findByAccountId(UUID accountId);
}
