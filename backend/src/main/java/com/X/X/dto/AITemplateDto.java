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
public class AITemplateDto {

    private String templateName;

    private String templateDescription;

    private Boolean isTemplateActive;

    private String templateType;
}

