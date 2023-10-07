package com.X.X.services;
import com.X.X.config.ResourceNotFoundException;
import com.X.X.domains.LoginLog;

import com.X.X.dto.*;
import com.X.X.repositories.LoginLogRepository;
import com.X.X.repositories.PasswordResetRepository;
import com.X.X.token.TokenServices;
import com.X.X.domains.User;
import com.X.X.help.Status;

import org.springframework.http.HttpStatus;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.X.X.repositories.UserRepository;
import org.springframework.web.server.ResponseStatusException;


import javax.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;


@Service
public record UserService(UserRepository userRepo,
                          PasswordEncoder passwordEncoder,
                          TokenServices tokenServices, EmailService emailService, PasswordResetRepository passwordResetRepository,
                          LoginLogRepository loginLogRepository,  HttpServletRequest request) {


    public LoginResponse login(LoginDTO loginDTO) {
        User user = userRepo.findByEmail(loginDTO.getEmail());

        if (passwordEncoder.matches(loginDTO.getPassword(), user.getPassword())) {
            if(user.isUserActive() != false){
                String token = tokenServices.generateTokenUser(user, loginDTO.isRememberMe());
                UUID accountId = user.getAccountId();
                return new LoginResponse(token, Status.OK, accountId, "Success");
            }
            else{
                return new LoginResponse("", Status.FAILED, null, "User is not active");            }
        } else {
            return new LoginResponse("", Status.FAILED, null, "Error, please try again");
        }

    }

    public RegisterResponse register(RegisterDTO registerDTO) {
        // Check if a user with the same username already exists
        if (userRepo.findByUsername(registerDTO.getUsername()) != null || userRepo.findByEmail(registerDTO.getEmail()) != null) {
            return new RegisterResponse(Status.FAILED, "Exists");
        }

        // Register the new user
        User newUser = User.builder()
                .userId(UUID.randomUUID())
                .accountId(UUID.randomUUID())
                .username(registerDTO.getUsername())
                .email(registerDTO.getEmail())
                .password(passwordEncoder.encode(registerDTO.getPassword()))
                .firstName(registerDTO.getFirstName())
                .lastName(registerDTO.getLastName())
                .role(registerDTO.isRole()  )
                .address(registerDTO.getAddress())
                .country(registerDTO.getCountry())
                .postalCode(registerDTO.getPostalCode())
                .city(registerDTO.getCity())
                .phoneNumber(registerDTO.getPhoneNumber())
                .accountRole(true)
                .isLinkedToTeamGroup(false)
                .firstTimeLoggedIn(false)
                .build();
        try {
            userRepo.save(newUser);
            return new RegisterResponse(Status.OK, "Saved");
        } catch (Exception e) {
            System.out.println(e);
            return new RegisterResponse(Status.FAILED, "Error");
        }
    }

    public UUID getLoggedInUserAccountId(String token) {
        if (!tokenServices.validateToken(token)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid or expired authorization token");
        }
        String email = tokenServices.getMail(token);
        User user = userRepo.findByEmail(email);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid user");
        }
        return user.getAccountId();
    }

    public UUID getLoggedInUserId(String token) {
        if (!tokenServices.validateToken(token)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid or expired authorization token");
        }
        String email = tokenServices.getMail(token);
        User user = userRepo.findByEmail(email);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid user");
        }
        return user.getUserId();
    }

    public User getUserRole(String token) {
        if (!tokenServices.validateToken(token)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid or expired authorization token");
        }
        String email = tokenServices.getMail(token);
        User user = userRepo.findByEmail(email);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid user");
        }
        return user;
    }

    public List<User> getAllUser() {
        return userRepo.findAll();
    }

    public List<User> getInactiveUsers() {
        return userRepo.findInactiveUser();
    }

    public User saveDefaultLanguage(User user){
        return userRepo.save(user);
    }

    public User updatePassword(User user, UpdatePasswordDto userDetails){
        user.setPassword(passwordEncoder.encode(userDetails.getPassword()));
        return userRepo.save(user);
    }

    public User changeTheme(User user, String theme){
        user.setThemeMode(theme);
        return userRepo.save(user);
    }

    public User updateUser(UUID accountId, User userDetails) {
        User user = userRepo.findByAccountId(accountId);
        if (user == null) {
            throw new ResourceNotFoundException("User not found with accountId: " + accountId);
        }
        user.setUsername(userDetails.getUsername());
        user.setEmail(userDetails.getEmail());
        user.setFirstName(userDetails.getFirstName());
        user.setLastName(userDetails.getLastName());
        user.setRole(userDetails.isRole());
        user.setUserActive(userDetails.isUserActive());
        user.setAdvertisementEnabled(userDetails.isAdvertisementEnabled());
        user.setImageUploadFeatureEnabled(userDetails.isImageUploadFeatureEnabled());
        user.setAdvertisementImportEnabled(userDetails.isAdvertisementImportEnabled());
        user.setAdvertisementLimit(userDetails.getAdvertisementLimit());
        user.setPostalCode(userDetails.getPostalCode());
        user.setAddress(userDetails.getAddress());
        user.setCity(userDetails.getCity());
        user.setPhoneNumber(userDetails.getPhoneNumber());
        user.setCountry(userDetails.getCountry());
        user.setAccountRole(userDetails.getAccountRole());
        user.setCustomTabEnabled(userDetails.isCustomTabEnabled());
        user.setCopyWritingEnabled(userDetails.isCopyWritingEnabled());
        user.setAutomationEnabled(userDetails.isAutomationEnabled());
        user.setSpyToolsEnabled(userDetails.isSpyToolsEnabled());
        user.setProductSearchEnabled(userDetails.isProductSearchEnabled());

        return userRepo.save(user);
    }


    public User updateUserManagement(UUID id, User userDetails) {
        User user = userRepo.findByUserId(id);
        if (user == null) {
            throw new ResourceNotFoundException("User not found with User id: " + id);
        }
        user.setUsername(userDetails.getUsername());
        user.setEmail(userDetails.getEmail());
        user.setFirstName(userDetails.getFirstName());
        user.setLastName(userDetails.getLastName());
        user.setRole(userDetails.isRole());
        user.setUserActive(userDetails.isUserActive());
        user.setAdvertisementEnabled(userDetails.isAdvertisementEnabled());
        user.setImageUploadFeatureEnabled(userDetails.isImageUploadFeatureEnabled());
        user.setAdvertisementImportEnabled(userDetails.isAdvertisementImportEnabled());
        user.setAdvertisementLimit(userDetails.getAdvertisementLimit());
        user.setPostalCode(userDetails.getPostalCode());
        user.setAddress(userDetails.getAddress());
        user.setCity(userDetails.getCity());
        user.setPhoneNumber(userDetails.getPhoneNumber());
        user.setCountry(userDetails.getCountry());
        user.setAccountRole(userDetails.getAccountRole());
        user.setProductFormType(userDetails.getProductFormType());
        user.setCustomTabEnabled(userDetails.isCustomTabEnabled());
        user.setDefaultAdvertisementLocation(userDetails.getDefaultAdvertisementLocation());
        user.setDefaultAdvertisementLanguage(userDetails.getDefaultAdvertisementLanguage());
        user.setDefaultAdvertisementLength(userDetails.getDefaultAdvertisementLength());
        user.setDefaultAdvertisementMood(userDetails.getDefaultAdvertisementMood());
        user.setDefaultCopyLanguage(userDetails.getDefaultCopyLanguage());
        user.setDefaultCopyLength(userDetails.getDefaultCopyLength());
        user.setDefaultCopyTone(userDetails.getDefaultCopyTone());
        user.setDefaultCopyType(userDetails.getDefaultCopyType());
        user.setDefaultBrandDescription(userDetails.getDefaultBrandDescription());
        user.setDefaultBrandName(userDetails.getDefaultBrandName());
        user.setFirstTimeLoggedIn(userDetails.getFirstTimeLoggedIn());
        user.setCopyWritingEnabled(userDetails.isCopyWritingEnabled());
        user.setAutomationEnabled(userDetails.isAutomationEnabled());
        user.setSpyToolsEnabled(userDetails.isSpyToolsEnabled());
        user.setProductSearchEnabled(userDetails.isProductSearchEnabled());

        return userRepo.save(user);
    }



    public User getSingleUser(UUID id) {
        return userRepo.findByUserId(id);
    }

    public User getSingleAccountUser(UUID id) {
        return userRepo.findByUserId(id);
    }

    public List<User> getAllUserForAccount(UUID accountId, UUID userId) {
        return userRepo.findAllByAccountIdAndAccountRoleNot(accountId, userId);
    }

    public List<User> getAllUserForAccountTeam(UUID accountId, UUID userId) {
        return userRepo.findAllByAccountIdExceptCurrent(accountId, userId);
    }

    public User getUserByUserId(UUID userId) {
        return userRepo.findByUserId(userId);
    }

    public void blacklistToken(String token) {
        tokenServices.blacklistToken(token);
    }

    public User getUserByEmail(String email){
        return userRepo.findByEmail(email);
    }

    public User saveUser(User user){
        return userRepo.save(user);
    }


    public RegisterResponse registerOrganisationUser(RegisterDTO registerDTO, UUID accountId) {
        // Check if a user with the same username already exists
        if (userRepo.findByUsername(registerDTO.getUsername()) != null || userRepo.findByEmail(registerDTO.getEmail()) != null) {
            return new RegisterResponse(Status.FAILED, "Exists");
        }

        // Register the new user
        User newUser = User.builder()
                .userId(UUID.randomUUID())
                .accountId(accountId)
                .username(registerDTO.getUsername())
                .email(registerDTO.getEmail())
                .password(passwordEncoder.encode(registerDTO.getPassword()))
                .firstName(registerDTO.getFirstName())
                .lastName(registerDTO.getLastName())
                .role(registerDTO.isRole()  )
                .address(registerDTO.getAddress())
                .country(registerDTO.getCountry())
                .postalCode(registerDTO.getPostalCode())
                .city(registerDTO.getCity())
                .phoneNumber(registerDTO.getPhoneNumber())
                .accountRole(registerDTO.isAccountRole())
                .isLinkedToTeamGroup(true)
                .firstTimeLoggedIn(false)
                .build();
        try {
            userRepo.save(newUser);
            return new RegisterResponse(Status.OK, "Ok");
        } catch (Exception e) {
            System.out.println(e);
            return new RegisterResponse(Status.FAILED, "Error");
        }
    }

    public void performLogin(String username) {
        String userIp = request.getHeader("X-Forwarded-For");
        if (userIp == null || userIp.isEmpty() || "unknown".equalsIgnoreCase(userIp)) {
            userIp = request.getRemoteAddr();
        }

        LocalDateTime loginTime = LocalDateTime.now();
        String userAgent = request.getHeader("User-Agent");
        LocalDateTime requestTimestamp = LocalDateTime.now();

        LoginLog loginLog = LoginLog.builder()
                .userEmail(username)
                .userIp(userIp)
                .loginTime(loginTime)
                .userAgent(userAgent)
                .requestTimestamp(requestTimestamp)
                .build();

        try {
            loginLog.setResultStatus("SUCCESS");

        } catch (Exception e) {
            loginLog.setResultStatus("FAILED");
            loginLog.setErrorDetails(e.getMessage());
        }

        loginLogRepository.save(loginLog);
    }


}
