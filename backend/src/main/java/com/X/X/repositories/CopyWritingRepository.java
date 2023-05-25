package com.X.X.repositories;

import com.X.X.domains.CopyWriting;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CopyWritingRepository extends CrudRepository<CopyWriting, UUID> {
    CopyWriting findByid(UUID id);
    List<CopyWriting> findByAccountId(UUID accountId);

}
