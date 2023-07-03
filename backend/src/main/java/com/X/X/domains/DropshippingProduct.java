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

import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor(access = AccessLevel.PRIVATE)
@AllArgsConstructor
@Builder
@Entity
@Table(name="dropshipping_product")
public class DropshippingProduct extends Auditable  {
    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Column(name = "id", updatable = false, nullable = false, columnDefinition = "VARCHAR(36)")
    @Type(type = "uuid-char")
    private UUID id;

    private String title;

    private String description;

    private String price;

    private String Image;

    private String category;

    private String saturation;

    private String demand;

    private String profitMargin;

    private String suppliers;

    private String similarItems;

    private String targeting;

    private String analytics;

    private String facebookAds;

    private String productScore;

    @OneToMany(mappedBy = "dropShippingProductId", fetch = FetchType.LAZY)
    private List<FileUpload> additionalImages;


    public DropshippingProduct(DropshippingProduct getProduct) {
        this.title = getProduct.title;
        this.description = getProduct.description;
        this.facebookAds = getProduct.facebookAds;
        this.targeting = getProduct.targeting;
        this.similarItems = getProduct.similarItems;
        this.profitMargin = getProduct.profitMargin;
        this.demand = getProduct.demand;
        this.saturation = getProduct.saturation;
        this.category = getProduct.category;
        this.Image = getProduct.Image;
        this.price = getProduct.price;
        this.productScore = getProduct.productScore;
    }
}
