package com.fooboo.exception;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    // Centralized error response builder
    private ResponseEntity<ErrorResponse> buildErrorResponse(Exception ex, HttpStatus status, WebRequest request) {

        // Fallback message if null/empty
        String message = (ex.getMessage() == null || ex.getMessage().isBlank())
                ? switch (status) {
                    case NOT_FOUND -> "The requested resource was not found.";
                    case BAD_REQUEST -> "Invalid request data.";
                    case UNAUTHORIZED -> "Authentication required or token invalid.";
                    case FORBIDDEN -> "Access denied.";
                    default -> "An unexpected error occurred.";
                }
                : ex.getMessage();

        ErrorResponse errorResponse = new ErrorResponse(
                LocalDateTime.now(),
                status.value(),
                status.getReasonPhrase(),
                message,
                request.getDescription(false).replace("uri=", "")
        );

        return new ResponseEntity<>(errorResponse, status);
    }


    // Validation Errors from @Valid (RequestBody)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex, WebRequest request) {

        String errorMessages = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(err -> err.getField() + ": " + err.getDefaultMessage())
                .collect(Collectors.joining("; "));

        return buildErrorResponse(
                new BadRequestException(errorMessages),
                HttpStatus.BAD_REQUEST,
                request
        );
    }

    // Validation Errors from @Validated (RequestParam, PathVariable)
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErrorResponse> handleConstraintViolations(ConstraintViolationException ex, WebRequest request) {

        String messages = ex.getConstraintViolations()
                .stream()
                .map(ConstraintViolation::getMessage)
                .collect(Collectors.joining("; "));

        return buildErrorResponse(
                new BadRequestException(messages),
                HttpStatus.BAD_REQUEST,
                request
        );
    }


    // Custom Exceptions (404, 400, 401)
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException ex, WebRequest req) {
        return buildErrorResponse(ex, HttpStatus.NOT_FOUND, req);
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ErrorResponse> handleBadRequest(BadRequestException ex, WebRequest req) {
        return buildErrorResponse(ex, HttpStatus.BAD_REQUEST, req);
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ErrorResponse> handleUnauthorized(UnauthorizedException ex, WebRequest req) {
        return buildErrorResponse(ex, HttpStatus.UNAUTHORIZED, req);
    }


    // 403 Forbidden
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDenied(AccessDeniedException ex, WebRequest req) {
        return buildErrorResponse(ex, HttpStatus.FORBIDDEN, req);
    }

    // Database Errors (Optional but smart)
    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<ErrorResponse> handleDatabaseErrors(DataAccessException ex, WebRequest req) {
        log.error("Database error: ", ex);
        return buildErrorResponse(new BadRequestException("Database error occurred."), HttpStatus.BAD_REQUEST, req);
    }

    // Global Fallback Handler
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleAllExceptions(Exception ex, WebRequest req) {
        log.error("Unhandled exception occurred", ex);
        return buildErrorResponse(ex, HttpStatus.INTERNAL_SERVER_ERROR, req);
    }
}
