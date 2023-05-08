package com.X.X.domains;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.Column;
import javax.persistence.EntityListeners;
import javax.persistence.MappedSuperclass;
import java.time.LocalDateTime;

@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class Auditable {
    @CreatedBy
    @JsonProperty("created_by")
    @Column(name = "created_by")
    private String createdBy;

    @CreatedDate
    @JsonProperty("created_at")
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @LastModifiedBy
    @JsonProperty("updated_by")
    @Column(name = "updated_by")
    private String updatedBy;

    @LastModifiedDate
    @JsonProperty("updated_at")
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // getters and setters
}
