package com.X.X.controller;

import com.X.X.domains.GenerateDescription;
import com.X.X.domains.GenerateProductDescription;
import com.X.X.domains.GenerateTitle;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/gpt3")
public class AdvertisementGenerator {
    private String apiKey = System.getenv("openAi");

    private final RestTemplate restTemplate = new RestTemplate();
    private final float TEMPERATURE = 0.7f;
    private final int MAX_TOKENS = 800;

    @CrossOrigin
    @PostMapping("/generate-title")
    public ResponseEntity<String> generateTitle(
            @RequestBody GenerateTitle request
    ) {

        String prompt = "Create a title for" + request.getProductName() + "in" + request.getLanguage();
        String requestBody = "{ \"prompt\": \"" + prompt + "\", \"temperature\": " + TEMPERATURE + ", \"max_tokens\": " + MAX_TOKENS + " }";
        String title = generateText(requestBody, "text-davinci-002");

        return ResponseEntity.ok(title);
    }

    @CrossOrigin
    @PostMapping("/generate-description")
    public ResponseEntity<String> generateDescription(
            @RequestBody GenerateDescription generateDescription
    ) {


        String prompt = "Create a advertisement description for a product called " + generateDescription.getProductName() + " in" + generateDescription.getLanguage()
                + " language for " + generateDescription.getAdvertisementLocation() + "." + "This is a brief description of the product : " + generateDescription.getProductDescription() + "." +
                "The product type is a " + generateDescription.getProductType() + " And my target audience is " + generateDescription.getTargetAudience() + "." + " The tone of the writing should be " + generateDescription.getMood() + " and please make the text " + generateDescription.getLength() + " in length";

        String requestBody = "{ \"prompt\": \"" + prompt + "\", \"temperature\": " + TEMPERATURE + ", \"max_tokens\": " + MAX_TOKENS + " }";
        String description = generateText(requestBody, "text-davinci-003");

        return ResponseEntity.ok(description);
    }

    @CrossOrigin
    @PostMapping("/generateProductInformation")
    public ResponseEntity<String> generateProductInformation(
            @RequestBody GenerateProductDescription generateProductDescription
    )

    {
        String prompt = "I will give you a link to a product please extract all information possible below. Extract the product information from this link " + generateProductDescription.getUrl() +
                " is the product viable in this market? Is there a high demand on this product? Is there any competition and is the product hard to scale? " +
                " Also please provide in detail how i can advertise this product and list the potential target audience for this product and what kind of advertisement will be suitable for this product" +
                " Give me some steps to sell this product and my profit margins if i decide to sell this product. Please separate all the information based on the questions asked so it can be extracted easily";


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



