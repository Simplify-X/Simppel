
package com.X.X.domains;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor(access = AccessLevel.PRIVATE)
@AllArgsConstructor
public class CopyWritingDescriptionDto {

    private String targetAudience;
    private String description;
    private String keywords;
    private String language;
    private String length;
    private String tone;
    private String brandName;
    private String brandDescription;
    private String customCommands;
    private String copyWritingType;

}
