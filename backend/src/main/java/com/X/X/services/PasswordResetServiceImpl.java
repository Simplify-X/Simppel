package com.X.X.services;

import com.X.X.domains.PasswordReset;
import com.X.X.repositories.PasswordResetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class PasswordResetServiceImpl implements PasswordResetService {

    @Autowired
    private PasswordResetRepository passwordResetRepository;

    @Override
    public PasswordReset savePasswordReset(PasswordReset passwordReset) {
        return passwordResetRepository.save(passwordReset);
    }

    @Override
    public PasswordReset getPasswordResetById(Long id) {
        Optional<PasswordReset> optionalPasswordReset = passwordResetRepository.findById(id);
        return optionalPasswordReset.orElse(null);
    }

    @Override
    public PasswordReset getPasswordResetByToken(String token) {
        return passwordResetRepository.findByToken(token);
    }

    @Override
    public void deletePasswordReset(PasswordReset passwordReset) {
        passwordResetRepository.delete(passwordReset);
    }
}

