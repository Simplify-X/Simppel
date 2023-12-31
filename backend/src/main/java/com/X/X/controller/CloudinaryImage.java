package com.X.X.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
// other imports

@RestController
@RequestMapping("/getImages")
public class CloudinaryImage {

    private String cloudinaryApiKey = "162512336513259";
    private String cloudinaryApiSecret = "t4wMuFEdVexbMB_X-JKlTqh5j3Q";
    private String cloudinaryCloudName = "dovfsnzn8";
    private final RestTemplate restTemplate;

    @Autowired
    public CloudinaryImage(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @CrossOrigin
    @GetMapping("/fetch/{folderId}")
    public ResponseEntity<?> fetchImages(@PathVariable String folderId) {
        String url = String.format("https://api.cloudinary.com/v1_1/%s/resources/image?prefix=%s&type=upload",
                cloudinaryCloudName, folderId);

        HttpHeaders headers = new HttpHeaders();
        headers.setBasicAuth(cloudinaryApiKey, cloudinaryApiSecret);

        try {
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, new HttpEntity<>(headers), String.class);
            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching images");
        }
    }
}
