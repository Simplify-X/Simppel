package com.X.X.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterDTO {
    private String username;
    private String email;
    private String password;
    private boolean role;
    private String firstName;
    private String lastName;
    private String address;
    private String postalCode;
    private String city;
    private String phoneNumber;
    private String country;
}
