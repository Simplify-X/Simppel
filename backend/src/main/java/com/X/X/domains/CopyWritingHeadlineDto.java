package com.X.X.domains;

import lombok.*;

import javax.persistence.Entity;

@Data
@NoArgsConstructor(access = AccessLevel.PRIVATE)
@AllArgsConstructor
public class CopyWritingHeadlineDto {

    private String title;
    private String language;

}
