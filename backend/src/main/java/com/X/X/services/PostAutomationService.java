package com.X.X.services;

import com.X.X.domains.PostAutomation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.X.X.repositories.PostAutomationRepository;

import java.util.List;
import java.util.UUID;


@Service
public class PostAutomationService {
    @Autowired
    private PostAutomationRepository postAutomationRepository;

    public PostAutomation saveAdvertisement(PostAutomation postAutomation) {
        return postAutomationRepository.save(postAutomation);
    }

    public List<PostAutomation> getAutomation(UUID accountId) {
        return postAutomationRepository.findByAccountId(accountId);
    }

}
