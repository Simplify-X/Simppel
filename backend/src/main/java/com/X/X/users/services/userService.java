package com.X.X.users.services;

import com.X.X.token.TokenServices;
import com.X.X.users.data.dto.LoginDTO;
import com.X.X.users.data.dto.LoginResponse;
import com.X.X.users.data.dto.registerDTO;
import com.X.X.users.data.dto.registerResponse;
import com.X.X.users.data.user;
import com.X.X.users.help.status;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.X.X.users.services.userRepo;
@Service
public class userService {
    private final userRepo userRepo;
    private final PasswordEncoder passwordEncoder;
    private final TokenServices tokenServices;

    public userService(com.X.X.users.services.userRepo userRepo, PasswordEncoder passwordEncoder, TokenServices tokenServices) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
        this.tokenServices = tokenServices;
    }

    public LoginResponse login(LoginDTO loginDTO){
        user user  = userRepo.findByEmail(loginDTO.getEmail());
        if(passwordEncoder.matches(loginDTO.getPassword(),user.getPassword()))
        {
            String token = tokenServices.generateTokenUser(user,loginDTO.isRememberMe());
            return new LoginResponse(token, status.OK);
        }
        else {
            return new LoginResponse("",status.FAILED);
        }

    }
    public registerResponse register(registerDTO registerDTO){
        String username = registerDTO.getUsername();
        String email = registerDTO.getEmail();

        // Check if a user with the same username already exists
        if (userRepo.findByUsername(username) != null || userRepo.findByEmail(email) != null) {
            return new registerResponse(status.FAILED);
        }

        // Register the new user
        user newUser = new user(username, email, passwordEncoder.encode(registerDTO.getPassword()));
        try {
            userRepo.save(newUser);
            return new registerResponse(status.OK);
        } catch (Exception e) {
            return new registerResponse(status.FAILED);
        }
    }
}
