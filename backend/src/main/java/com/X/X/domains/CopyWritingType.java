package com.X.X.domains;

public enum CopyWritingType {
    WEBSITE_COPY, SEO_COPY, B2B_COPY, B2C_COPY, DIRECT_COPY, AD_COPY, SOCIAL_MEDIA_COPY;

    public static CopyWritingType fromString(String value) {
        switch (value) {
            case "WEBSITE_COPY":
                return WEBSITE_COPY;
            case "SEO_COPY":
                return SEO_COPY;
            case "B2B_COPY":
                return B2B_COPY;
            case "B2C_COPY":
                return B2C_COPY;
            case "DIRECT_COPY":
                return DIRECT_COPY;
            case "AD_COPY":
                return AD_COPY;
            case "SOCIAL_MEDIA_COPY":
                return SOCIAL_MEDIA_COPY;
            default:
                throw new IllegalArgumentException("Invalid advertisement access value: " + value);
        }
    }
}