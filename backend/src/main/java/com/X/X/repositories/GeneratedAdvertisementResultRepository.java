package com.X.X.repositories;

import com.X.X.domains.GeneratedAdvertisementResult;
import com.X.X.domains.PostAutomation;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.UUID;

public interface GeneratedAdvertisementResultRepository  extends CrudRepository<GeneratedAdvertisementResult, UUID> {

    GeneratedAdvertisementResult findByAdvertisementId(UUID advertisementId);
}
