package com.X.X.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.X.X.help.Status;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResponseStatus {
    private Status status;
    private String message;
}
