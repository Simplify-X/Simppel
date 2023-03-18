package com.X.X;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.web.bind.annotation.CrossOrigin;

@EnableJpaRepositories("com.X.X.repositories")
@EntityScan("com.X.X.domains")
@SpringBootApplication
public class XApplication {

	public static void main(String[] args) {
		SpringApplication.run(XApplication.class, args);
		
	}

}
