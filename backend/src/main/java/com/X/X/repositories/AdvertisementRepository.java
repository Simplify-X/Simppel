package com.X.X.repositories;

import com.X.X.domains.Advertisement;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AdvertisementRepository extends CrudRepository<Advertisement,UUID> {
    Advertisement findById(long id);
    Advertisement findByName(String name);
    List<Advertisement> findByAccountId(UUID accountId);

}
