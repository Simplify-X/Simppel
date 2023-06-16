package com.X.X.repositories;


import com.X.X.domains.DynamicField;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DynamicFieldRepository extends JpaRepository<DynamicField, UUID> {

    List<DynamicField> findByCustomFormId(UUID customFormId);

}

