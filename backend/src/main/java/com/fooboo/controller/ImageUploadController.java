package com.fooboo.controller;

import com.fooboo.exception.SuccessResponse;
import com.fooboo.service.CloudinaryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/upload")
public class ImageUploadController {

    private final CloudinaryService cloudinaryService;

    public ImageUploadController(CloudinaryService cloudinaryService) {
        this.cloudinaryService = cloudinaryService;
    }

    @PostMapping("/food")
    public ResponseEntity<SuccessResponse> uploadFoodImage(@RequestParam("file") MultipartFile file) throws Exception {

        String url = cloudinaryService.uploadFile(file);

        return ResponseEntity.ok(
                new SuccessResponse(
                        LocalDateTime.now(),
                        200,
                        "Image uploaded successfully",
                        url
                )
        );
    }

    @PostMapping("/category")
    public ResponseEntity<SuccessResponse> uploadCategoryImage(@RequestParam("file") MultipartFile file) throws Exception {

        String url = cloudinaryService.uploadFile(file);

        return ResponseEntity.ok(
                new SuccessResponse(
                        LocalDateTime.now(),
                        200,
                        "Category image uploaded successfully",
                        url
                )
        );
    }
}
