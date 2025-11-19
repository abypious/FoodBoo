package com.fooboo.exception;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

@RestControllerAdvice
public class JwtExceptionHandlers {

    private ResponseEntity<ErrorResponse> build(Exception ex, HttpStatus status, WebRequest request) {

        ErrorResponse response = new ErrorResponse(
                java.time.LocalDateTime.now(),
                status.value(),
                status.getReasonPhrase(),
                ex.getMessage(),
                request.getDescription(false).replace("uri=", "")
        );

        return new ResponseEntity<>(response, status);
    }

    @ExceptionHandler(ExpiredJwtException.class)
    public ResponseEntity<ErrorResponse> handleExpiredJwt(ExpiredJwtException ex, WebRequest req) {
        return build(new UnauthorizedException("JWT token expired."), HttpStatus.UNAUTHORIZED, req);
    }

    @ExceptionHandler(MalformedJwtException.class)
    public ResponseEntity<ErrorResponse> handleMalformedJwt(MalformedJwtException ex, WebRequest req) {
        return build(new UnauthorizedException("Malformed JWT token."), HttpStatus.UNAUTHORIZED, req);
    }

    @ExceptionHandler(SignatureException.class)
    public ResponseEntity<ErrorResponse> handleSignature(SignatureException ex, WebRequest req) {
        return build(new UnauthorizedException("Invalid JWT signature."), HttpStatus.UNAUTHORIZED, req);
    }
}
