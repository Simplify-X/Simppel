package com.X.X.repositories;

import com.X.X.domains.GeneratedAdvertisementResult;
import com.X.X.domains.GeneratedCopyWritingResult;
import com.X.X.domains.LoginLog;
import com.X.X.domains.PostAutomation;
import lombok.extern.java.Log;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface LoginLogRepository extends JpaRepository<LoginLog, Long> {
    // Define repository methods if needed
    // ...
}

