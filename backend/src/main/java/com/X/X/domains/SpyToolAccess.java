package com.X.X.domains;

public enum SpyToolAccess {
    VIEW, BOTH;

    public static SpyToolAccess fromString(String value) {
        switch (value) {
            case "VIEW":
                return VIEW;
            case "BOTH":
                return BOTH;
            default:
                throw new IllegalArgumentException("Invalid advertisement access value: " + value);
        }
    }
}