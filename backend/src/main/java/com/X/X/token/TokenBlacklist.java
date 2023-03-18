package com.X.X.token;
import java.util.HashSet;
import java.util.Set;

public class TokenBlacklist {
    private static final Set<String> BLACKLIST = new HashSet<>();

    public static boolean isTokenBlacklisted(String token) {
        return BLACKLIST.contains(token);
    }

    public static void blacklistToken(String token) {
        BLACKLIST.add(token);
    }

    public static void clearBlacklist() {
        BLACKLIST.clear();
    }
}
