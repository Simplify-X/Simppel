package com.X.X.domains;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.sun.istack.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;


import lombok.*;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name="users",uniqueConstraints = { @UniqueConstraint(columnNames = { "email"})})
public class User extends Auditable {
    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Column(name = "user_id", updatable = false, nullable = false, columnDefinition = "VARCHAR(36)")
    @Type(type = "uuid-char")
    private UUID userId;

    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Column(name = "account_id", updatable = false, nullable = false, columnDefinition = "VARCHAR(36)")
    @Type(type = "uuid-char")
    private UUID accountId;

    @NotNull
    private String username;

    @NotNull
    private String firstName;

    @NotNull
    private String lastName;

    private boolean role;

    private String email;

    @JsonIgnore
    private String password;

    private boolean userActive;

    private boolean advertisementEnabled;

    private boolean isImageUploadFeatureEnabled;

    private boolean isAdvertisementImportEnabled;

    private Integer advertisementLimit;

    private String themeMode;

    private String address;

    private String postalCode;

    private String city;

    private String phoneNumber;

    private String country;

    private Boolean accountRole;

    private String defaultLanguage;

    private Boolean isLinkedToTeamGroup;


}
