package com.X.X.controller;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/gpt3")
public class AdvertisementGenerator {
    private String apiKey = System.getenv("openAi");

    private final RestTemplate restTemplate = new RestTemplate();
    private final float TEMPERATURE = 0.7f;
    private final int MAX_TOKENS = 300;

    @PostMapping("/generate-title")
    public ResponseEntity<String> generateTitle(
            @RequestParam("productName") String productName,
            @RequestParam("language") String language
    ) {

        String prompt = "Create a title for" + productName + "in" + language;
        String requestBody = "{ \"prompt\": \"" + prompt + "\", \"temperature\": " + TEMPERATURE + ", \"max_tokens\": " + MAX_TOKENS + " }";
        String title = generateText(requestBody, "text-davinci-002");

        return ResponseEntity.ok(title);
    }

    @PostMapping("/generate-description")
    public ResponseEntity<String> generateDescription(
            @RequestParam("productName") String productName,
            @RequestParam("productDescription") String productDescription,
            @RequestParam("targetAudience") String targetAudience,
            @RequestParam("advertisementLocation") String advertisementLocation,
            @RequestParam("language") String language,
            @RequestParam("length") String length,
            @RequestParam("mood") String mood,
            @RequestParam("productType") String productType
    ) {


        String prompt = "Create a advertisement description for a product called " + productName + "in" + language
                + " language for " + advertisementLocation + "." + "This is a brief description of the product : " + productDescription + "." +
                "The product type is a " + productType + "And my target audience is" + targetAudience + "." + " The tone of the writing should be " + mood + "and please make the text " + length + "in length";

        String requestBody = "{ \"prompt\": \"" + prompt + "\", \"temperature\": " + TEMPERATURE + ", \"max_tokens\": " + MAX_TOKENS + " }";
        String description = generateText(requestBody, "text-davinci-003");

        return ResponseEntity.ok(description);
    }

    private String generateText(String requestBody, String engine) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + apiKey);

        HttpEntity<String> request = new HttpEntity<>(requestBody, headers);
        ResponseEntity<String> response = restTemplate.postForEntity("https://api.openai.com/v1/engines/" + engine + "/completions", request, String.class);

        return response.getBody();
    }
}



