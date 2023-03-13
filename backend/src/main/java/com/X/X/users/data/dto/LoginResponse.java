package com.X.X.users.data.dto;

import com.X.X.users.help.status;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponse {
    private String token;
    private com.X.X.users.help.status status;
}
