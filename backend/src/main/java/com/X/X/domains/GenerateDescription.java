package com.X.X.domains;

import lombok.*;

import javax.persistence.Entity;

@Data
@NoArgsConstructor(access = AccessLevel.PRIVATE)
@AllArgsConstructor
public class GenerateDescription {

    private String productName;
    private String productDescription;
    private String targetAudience;
    private String advertisementLocation;
    private String language;
    private String length;
    private String mood;
    private String productType;
    private String brandName;
    private String brandDescription;

}
