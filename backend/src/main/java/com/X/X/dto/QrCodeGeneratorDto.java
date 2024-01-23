package com.X.X.dto;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.sun.istack.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QrCodeGeneratorDto {

    private String name;

    private String price;

    private String description;

    private String clientEmail;

    private String clientPhone;

    private String clientWebsite;

    private String industry;

    private String location;

    private String status;

    private Boolean claimed;

    private String firstRule;

    private String secondRule;

    private String thirdRule;

    private String fourthRule;
}

