package com.X.X.users;

import com.X.X.users.data.dto.LoginDTO;
import com.X.X.users.data.dto.LoginResponse;
import com.X.X.users.data.dto.registerDTO;
import com.X.X.users.data.dto.registerResponse;
import com.X.X.users.help.status;
import org.springframework.web.bind.annotation.*;
import com.X.X.users.services.userService;

@RestController
@RequestMapping(path = "/users")
public class userController {
    private final userService userService;

    public userController(userService userService) {
        this.userService = userService;
    }

    @CrossOrigin
    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginDTO loginDTO) {
       try {
           return userService.login(loginDTO);
       }
       catch (Exception e){
           return new LoginResponse("", status.FAILED);
       }
    }
    @CrossOrigin
    @PostMapping("/register")
    public registerResponse register(@RequestBody registerDTO registerDTO) {
        try {
            return userService.register(registerDTO);
        }
        catch (Exception e){
            return new registerResponse(status.FAILED);
        }
    }

}
