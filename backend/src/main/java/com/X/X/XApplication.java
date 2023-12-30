package com.X.X;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.client.RestTemplate;

@EnableJpaRepositories("com.X.X.repositories")
@EnableJpaAuditing
@EntityScan("com.X.X.domains")
@SpringBootApplication
@OpenAPIDefinition(info =
@Info(title = "Simply API", version = "1.0", description = "Documentation Simply API v1.0")
)
public class XApplication {

	public static void main(String[] args) {
		SpringApplication.run(XApplication.class, args);
		
	}

	@Bean
	public RestTemplate restTemplate() {
		return new RestTemplate();
	}

}
