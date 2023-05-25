package com.X.X.repositories;

import com.X.X.domains.GeneratedAdvertisementResult;
import com.X.X.domains.GeneratedCopyWritingResult;
import com.X.X.domains.PostAutomation;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.UUID;

public interface GeneratedCopyWritingResultRepository  extends CrudRepository<GeneratedCopyWritingResult, UUID> {

    GeneratedCopyWritingResult findByCopyWritingId(UUID copyWritingId);
}
