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

import java.util.UUID;

@Data
@NoArgsConstructor(access = AccessLevel.PRIVATE)
@AllArgsConstructor
@Builder
@Entity
@Table(name="product")
public class Product extends Auditable  {
    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Column(name = "id", updatable = false, nullable = false, columnDefinition = "VARCHAR(36)")
    @Type(type = "uuid-char")
    private UUID id;

    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Column(name = "account_id", updatable = false, nullable = false, columnDefinition = "VARCHAR(36)")
    @Type(type = "uuid-char")
    @JsonIgnore
    private UUID accountId;

    private String title;

    private String description;

    private String brand;

    private String asin;

    private String unitCount;

    private String image;

    private String manufacturer;

    private String rating;

    private Boolean soldOnAmazon;

    private String productDimensions;

    private String itemModelNumber;

    private String countryOfOrigin;

    private String availability;

    private String dispatchDays;

    private Boolean isNew;

    private String productType;

    private Boolean isSoldByAmazon;

    private Boolean isFullfiledByAmazon;

    private Boolean isSoldByThirdParty;

    private Boolean isPrime;

    private String maximumOrderQuanitity;

    private String newOffersCount;

    private String price;

    private String rrp;

    private String shipping;





}
