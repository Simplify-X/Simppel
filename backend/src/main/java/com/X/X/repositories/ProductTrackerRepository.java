package com.X.X.repositories;

import com.X.X.domains.ProductTracker;
import com.X.X.domains.TeamGroup;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProductTrackerRepository extends CrudRepository<ProductTracker,UUID> {
    ProductTracker findByid(UUID id);
    ProductTracker findByTitle(String title);
    List<ProductTracker> findByAccountId(UUID accountId);


}
