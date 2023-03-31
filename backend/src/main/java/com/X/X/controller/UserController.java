package com.X.X.controller;

import antlr.Token;
import com.X.X.config.ResourceNotFoundException;
import com.X.X.domains.User;
import com.X.X.dto.LoginDTO;
import com.X.X.dto.LoginResponse;
import com.X.X.dto.RegisterDTO;
import com.X.X.dto.RegisterResponse;
import com.X.X.help.Status;
import com.X.X.repositories.UserRepository;
import com.X.X.token.ValidTokenRequired;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.X.X.services.UserService;
import org.springframework.web.server.ResponseStatusException;
import com.X.X.token.TokenServices;
import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(path = "/users")
public class UserController {
    private final UserService userService;
    private TokenServices tokenServices;
    private UserRepository userRepository;


    public UserController(UserService userService) {
        this.userService = userService;
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
    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginDTO loginDTO) {
       try {
           return userService.login(loginDTO);
       }
       catch (Exception e){
           return new LoginResponse("", Status.FAILED, null);
       }
    }
    @CrossOrigin
    @PostMapping("/register")
    public RegisterResponse register(@RequestBody RegisterDTO registerDTO) {
        try {
            return userService.register(registerDTO);
        }
        catch (Exception e){
            return new RegisterResponse(Status.FAILED);
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
    @PutMapping("/users/{accountId}")
    public ResponseEntity<User> updateUser(@PathVariable UUID accountId, @RequestBody User userDetails) {
        User updatedUser = userService.updateUser(accountId, userDetails);
        return ResponseEntity.ok(updatedUser);
    }



    @CrossOrigin
    @GetMapping("/getSingleUser/{accountId}")
    public  User getAllUsers(@PathVariable UUID accountId) {
        return userService.getSingleUser(accountId);
    }


}
