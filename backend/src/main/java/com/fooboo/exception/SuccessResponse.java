package com.fooboo.exception;

import java.time.LocalDateTime;

public record SuccessResponse(
        LocalDateTime timestamp,
        int status,
        String message,
        Object data
) {}
