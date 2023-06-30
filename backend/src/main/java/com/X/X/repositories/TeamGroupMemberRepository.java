package com.X.X.repositories;

import com.X.X.domains.TeamGroup;
import com.X.X.domains.TeamGroupMember;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface TeamGroupMemberRepository extends CrudRepository<TeamGroupMember, UUID> {
    List<TeamGroupMember> findAll();

    @Query("SELECT tg FROM TeamGroupMember tg WHERE tg.teamGroupId = :id")
    List<TeamGroupMember> findByUserId(@Param("id") UUID id);

    @Query("SELECT tg FROM TeamGroupMember tg WHERE tg.userId = :id")
    TeamGroupMember findByUserIds(@Param("id") UUID id);

    @Query("SELECT tg FROM TeamGroupMember tg WHERE tg.id = :id")
    TeamGroupMember findByIds(@Param("id") UUID id);






}


