package com.X.X.domains;

import lombok.*;

import javax.persistence.Entity;

@Data
@NoArgsConstructor(access = AccessLevel.PRIVATE)
@AllArgsConstructor
public class GenerateTitle {

    private String productName;
    private String language;

}
