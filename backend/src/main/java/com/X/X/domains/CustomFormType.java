package com.X.X.domains;

public enum CustomFormType {
    ADMIN, ALL;

    public static CustomFormType fromString(String value) {
        switch (value) {
            case "ADMIN":
                return ADMIN;
            case "ALL":
                return ALL;
            default:
                throw new IllegalArgumentException("Invalid advertisement access value: " + value);
        }
    }
}
