package com.X.X.repositories;

import com.X.X.domains.PasswordReset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface PasswordResetRepository extends CrudRepository<PasswordReset, Long> {

    PasswordReset findByToken(String token);

    void deleteByExpiryDateBefore(LocalDateTime expiryDate);
}