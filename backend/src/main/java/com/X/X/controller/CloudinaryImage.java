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
    public ResponseEntity<String> fetchImages(@PathVariable String folderId) {
        String url = String.format("https://api.cloudinary.com/v1_1/%s/resources/image?prefix=%s&type=upload", cloudinaryCloudName, folderId);

        HttpHeaders headers = new HttpHeaders();
        headers.setBasicAuth(cloudinaryApiKey, cloudinaryApiSecret);
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
            return response;
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Error fetching images: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



}
