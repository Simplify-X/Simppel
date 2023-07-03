package com.X.X.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.X.X.help.Status;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResponseStatusWithId {
    private Status status;
    private UUID message;
}
