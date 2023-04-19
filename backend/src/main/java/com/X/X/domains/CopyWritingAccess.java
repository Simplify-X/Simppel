package com.X.X.domains;

public enum CopyWritingAccess {
    VIEW, ADD, BOTH;

    public static CopyWritingAccess fromString(String value) {
        switch (value) {
            case "VIEW":
                return VIEW;
            case "ADD":
                return ADD;
            case "BOTH":
                return BOTH;
            default:
                throw new IllegalArgumentException("Invalid advertisement access value: " + value);
        }
    }
}