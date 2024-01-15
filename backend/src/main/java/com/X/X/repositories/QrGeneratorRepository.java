package com.X.X.repositories;

import com.X.X.domains.Advertisement;
import com.X.X.domains.QrGenerator;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface QrGeneratorRepository extends CrudRepository<QrGenerator,UUID> {
    QrGenerator findByid(UUID id);
    Advertisement findByName(String name);
    List<QrGenerator> findByAccountId(UUID accountId);

}
