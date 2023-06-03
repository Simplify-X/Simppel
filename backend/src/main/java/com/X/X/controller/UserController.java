package com.X.X.controller;

import antlr.Token;
import com.X.X.config.ResourceNotFoundException;
import com.X.X.domains.PasswordReset;
import com.X.X.domains.User;
import com.X.X.dto.*;
import com.X.X.help.Status;
import com.X.X.repositories.PasswordResetRepository;
import com.X.X.repositories.UserRepository;
import com.X.X.services.EmailService;
import com.X.X.services.PasswordResetService;
import com.X.X.token.ValidTokenRequired;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.val;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.X.X.services.UserService;
import org.springframework.web.server.ResponseStatusException;
import com.X.X.token.TokenServices;
import javax.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(path = "/users")
public class UserController {
    private final UserService userService;
    private TokenServices tokenServices;
    private UserRepository userRepository;

    private EmailService emailService;
    private PasswordEncoder passwordEncoder;
    private PasswordResetService passwordResetService;
    private PasswordResetRepository passwordResetRepository;


    public UserController(UserService userService, EmailService emailService, PasswordEncoder passwordEncoder, PasswordResetService passwordResetService, PasswordResetRepository passwordResetRepository) {
        this.userService = userService;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
        this.passwordResetService = passwordResetService;
        this.passwordResetRepository = passwordResetRepository;
    }

    @CrossOrigin
    @GetMapping("/me")
    public UUID getCurrentUserAccountId(HttpServletRequest request) {
        String authToken = request.getHeader("Authorization");
        if (authToken == null || !authToken.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid or missing authorization token");
        }
        String token = authToken.substring(7); // Remove "Bearer " prefix
        return userService.getLoggedInUserAccountId(token);
    }

    @CrossOrigin
    @GetMapping("/my")
    public UUID getCurrentUserId(HttpServletRequest request) {
        String authToken = request.getHeader("Authorization");
        if (authToken == null || !authToken.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid or missing authorization token");
        }
        String token = authToken.substring(7); // Remove "Bearer " prefix
        return userService.getLoggedInUserId(token);
    }


    @CrossOrigin
    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginDTO loginDTO) {
       try {
           return userService.login(loginDTO);
       }
       catch (Exception e){
           return new LoginResponse("", Status.FAILED, null, "Error Trying to Log in");
       }
    }
    @CrossOrigin
    @PostMapping("/register")
    public RegisterResponse register(@RequestBody RegisterDTO registerDTO) {
        try {
            return userService.register(registerDTO);
        }
        catch (Exception e){
            return new RegisterResponse(Status.FAILED, "Error");
        }
    }

    @CrossOrigin
    @PostMapping("/register/account/{accountId}")
    public RegisterResponse registerOrganisationUser(@RequestBody RegisterDTO registerDTO, @PathVariable UUID accountId ) {
        try {
            return userService.registerOrganisationUser(registerDTO, accountId);
        }
        catch (Exception e){
            return new RegisterResponse(Status.FAILED, "Error");
        }
    }

    @CrossOrigin
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request) {
        String authToken = request.getHeader("Authorization");
        if (authToken == null || !authToken.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid or missing authorization token");
        }
        String token = authToken.substring(7); // Remove "Bearer " prefix
        userService.blacklistToken(token);
        return ResponseEntity.ok().build();
    }

    @CrossOrigin
    @GetMapping("/role")
    public User getUserRole(HttpServletRequest request) {
        String authToken = request.getHeader("Authorization");
        if (authToken == null || !authToken.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid or missing authorization token");
        }
        String token = authToken.substring(7); // Remove "Bearer " prefix
        return userService.getUserRole(token);
    }

    @CrossOrigin
    @GetMapping("/getAllUsers")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUser();
        return ResponseEntity.ok(users);
    }

    @CrossOrigin
    @GetMapping("/getInactiveUsers")
    public ResponseEntity<List<User>> getUnactiveUsers() {
        List<User> users = userService.getInactiveUsers();
        return ResponseEntity.ok(users);
    }

    @CrossOrigin
    @PutMapping("/users/{accountId}")
    public ResponseEntity<User> updateUser(@PathVariable UUID accountId, @RequestBody User userDetails) {
        User updatedUser = userService.updateUser(accountId, userDetails);
        return ResponseEntity.ok(updatedUser);
    }


    @CrossOrigin
    @PutMapping("/users/management/{id}")
    public ResponseEntity<User> updateUserManagement(@PathVariable UUID id, @RequestBody User userDetails) {
        User updatedUser = userService.updateUserManagement(id, userDetails);
        return ResponseEntity.ok(updatedUser);
    }



    @CrossOrigin
    @GetMapping("/getSingleUser/{id}")
    public  User getAllUsers(@PathVariable UUID id) {
        return userService.getSingleUser(id);
    }

    @CrossOrigin
    @GetMapping("/getAccountUser/{id}")
    public  User getSingleUserForAccount(@PathVariable UUID id) {
        return userService.getSingleAccountUser(id);
    }

    @CrossOrigin
    @GetMapping("/getUserForAccount/{accountId}")
    public List <User> getUsersForAccount(@PathVariable UUID accountId) {
        return userService.getAllUserForAccount(accountId);
    }


    @CrossOrigin
    @PostMapping("/reset/password")
    public ResponseEntity<String> resetPassword(@RequestParam("email") String email) {
        User user = userService.getUserByEmail(email);

        if (user == null) {
            return ResponseEntity.badRequest().body("User with email " + email + " not found");
        }

        String token = Jwts.builder()
                .setSubject(user.getUserId().toString())
                .setExpiration(new Date(System.currentTimeMillis() + (2 * 60 * 60 * 1000))) // 2 hours
                .signWith(SignatureAlgorithm.HS256, "your-secret-key")
                .compact();

        // Create new PasswordReset entity
        PasswordReset passwordReset = PasswordReset.builder()
                .user(user)
                .token(token)
                .expiryDate(LocalDateTime.now().plusHours(2))
                .used(false)
                .build();
        passwordResetService.savePasswordReset(passwordReset);

        // Generate token link
        String resetLink = "https://app.simppel.com/password-reset/change-password/" + passwordReset.getToken();

        // Send password reset email with token link
        this.emailService.sendPasswordResetEmail(user.getEmail(), resetLink, user.getUsername());

        return ResponseEntity.ok("Password reset link sent to " + email);
    }

    @CrossOrigin
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestParam("token") String token, @RequestParam("password") String password) {
        try {
            // Find PasswordReset entity by token
            val passwordReset = passwordResetRepository.findByToken(token);

            // Verify that PasswordReset entity exists and has not expired
            if (passwordReset == null) {
                return ResponseEntity.badRequest().body("Invalid or expired token");
            }

            if (passwordReset.getExpiryDate().isBefore(LocalDateTime.now())) {
                passwordResetService.deletePasswordReset(passwordReset);
                return ResponseEntity.badRequest().body("Invalid or expired token");
            }

            // Retrieve user by ID
            User user = userService.getUserByUserId(passwordReset.getUser().getUserId());

            // Update user password
            user.setPassword(passwordEncoder.encode(password));
            userService.saveUser(user);

            // Delete PasswordReset entity
            passwordResetService.deletePasswordReset(passwordReset);

            return ResponseEntity.ok("Password reset successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid or expired token");
        }
    }

    @CrossOrigin
    @PostMapping("/checkToken")
    public ResponseEntity<String> checkToken(@RequestParam("token") String token) {
        val passwordReset = passwordResetRepository.findByToken(token);

        if (passwordReset == null) {
            return ResponseEntity.ok("Invalid or expired token");
        }

        return ResponseEntity.ok("Token exists");

    }


    @CrossOrigin
    @PostMapping("/updateLanguagePreference")
    public ResponseEntity<String> updateLanguagePreference(@RequestParam("locale") String locale, @RequestParam("userId") UUID userId) {

        val user = userService.getSingleUser(userId);
        user.setDefaultLanguage(locale);
        userService.saveDefaultLanguage(user);
        return ResponseEntity.ok("Language Updated");

    }

    @CrossOrigin
    @PutMapping("/updatePassword")
    public ResponseEntity<String> updatePassword(@RequestBody UpdatePasswordDto userDetails) {

        val user = userService.getSingleUser(userDetails.getUserId());
        userService.updatePassword(user, userDetails);
        return ResponseEntity.ok("Language Updated");

    }

    @CrossOrigin
    @PostMapping("/changeThemeMode")
    public ResponseEntity<String> changeThemeMode(@RequestParam("theme") String theme, @RequestParam("userId") UUID userId) {
        val user = userService.getSingleUser(userId);
        userService.changeTheme(user, theme);
        return ResponseEntity.ok("Mode changed");
    }

}
