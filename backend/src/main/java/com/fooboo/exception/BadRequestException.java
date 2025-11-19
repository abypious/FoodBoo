package com.fooboo.exception;

public class BadRequestException extends RuntimeException {

    public BadRequestException(String message) {
        super(message);
    }

    public BadRequestException() {
        super("Invalid request data.");
    }
}
