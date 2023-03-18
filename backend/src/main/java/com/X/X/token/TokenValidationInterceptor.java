package com.X.X.token;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Component
public class TokenValidationInterceptor implements HandlerInterceptor {

    private final TokenServices tokenServices;

    @Autowired
    public TokenValidationInterceptor(TokenServices tokenServices) {
        this.tokenServices = tokenServices;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        HandlerMethod handlerMethod = (HandlerMethod) handler;
        ValidTokenRequired validTokenRequired = handlerMethod.getMethodAnnotation(ValidTokenRequired.class);
        if (validTokenRequired != null) {
            String authToken = request.getHeader("Authorization");
            if (authToken == null || !authToken.startsWith("Bearer ")) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid or missing authorization token");
            }
            String token = authToken.substring(7); // Remove "Bearer " prefix
            if (!tokenServices.validateToken(token)) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid or expired authorization token");
            }
        }
        return true;
    }
}
