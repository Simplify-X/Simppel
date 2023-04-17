package com.X.X.services;

import com.X.X.domains.PasswordReset;

public interface PasswordResetService {

    PasswordReset savePasswordReset(PasswordReset passwordReset);

    PasswordReset getPasswordResetById(Long id);

    PasswordReset getPasswordResetByToken(String token);

    void deletePasswordReset(PasswordReset passwordReset);
}
