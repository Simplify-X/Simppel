package com.X.X.repositories;


import com.X.X.domains.CustomForm;
import com.X.X.domains.DynamicField;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DynamicFieldRepository extends JpaRepository<DynamicField, UUID> {

    List<DynamicField> findByCustomFormId(UUID customFormId);
    List<DynamicField> findByTableId(UUID tableId);
    DynamicField findFirstByTableId(UUID tableId);

    @Query("SELECT df FROM DynamicField df LEFT JOIN CustomFields cf ON df.customFormId = cf.id WHERE df.tableId = :tableId")
    List<DynamicField> findByTableIdWithCustomFields(@Param("tableId") UUID tableId);

    @Query("SELECT df FROM DynamicField df WHERE df.tableId = :tableId AND df.fieldName = :fieldName")
    Optional<DynamicField> findByTableIdAndFieldName(@Param("tableId") UUID tableId, @Param("fieldName") String fieldName);



}

