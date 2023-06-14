package com.X.X.controller;

import com.X.X.domains.*;
import lombok.val;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/copyGenerator")
public class CopyWritingGenerator {
    private String apiKey = System.getenv("openAi");

    private final RestTemplate restTemplate = new RestTemplate();
    private final float TEMPERATURE = 0.7f;
    private final int MAX_TOKENS = 800;

    @CrossOrigin
    @PostMapping("/generate-title")
    public ResponseEntity<String> generateTitle(
            @RequestBody CopyWritingHeadlineDto request
    ) {

        String prompt = "Create a headline for" + request.getTitle() + "in" + request.getLanguage();
        String requestBody = "{ \"prompt\": \"" + prompt + "\", \"temperature\": " + TEMPERATURE + ", \"max_tokens\": " + MAX_TOKENS + " }";
        String title = generateText(requestBody, "text-davinci-002");

        return ResponseEntity.ok(title);
    }

    @CrossOrigin
    @PostMapping("/generate-description")
    public ResponseEntity<String> generateDescription(
            @RequestBody CopyWritingDescriptionDto generateDescription
    ) {

        String prompt;

        if(generateDescription.getKeywords() != null){

            prompt = "Create a copy writing creative with the following parameters " +  " in" + generateDescription.getLanguage()
                    + " language for " + generateDescription.getCopyWritingType() + "." + "This is a brief description of the content : " + generateDescription.getDescription() + "." +
                    " The target audience is " + generateDescription.getTargetAudience() + "." + " The tone of the writing should be " + generateDescription.getTone() + " and please make the text " + generateDescription.getLength() + " in length";



        }else{

            prompt = "Create a copy writing creative with the following parameters " +  " in" + generateDescription.getLanguage()
                    + " language for " + generateDescription.getCopyWritingType() + "." + "This is a brief description of the content : " + generateDescription.getDescription() + "." +
                    " The target audience is " + generateDescription.getTargetAudience() + "." + " The tone of the writing should be " +
                    generateDescription.getTone() + " and please make the text " + generateDescription.getLength() + " in length."
                    + " There are additional custom requests to take into consideration: " + generateDescription.getKeywords()+ ".";



        }



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



