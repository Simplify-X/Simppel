package com.X.X.repositories;

import com.X.X.domains.CustomFields;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


import java.util.List;
import java.util.UUID;

@Repository
public interface CustomFieldsRepository extends CrudRepository<CustomFields, UUID> {
    List<CustomFields> findByCustomFormId(UUID id);
}



