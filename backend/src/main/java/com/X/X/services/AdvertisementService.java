package com.X.X.services;

import com.X.X.domains.Advertisement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.X.X.repositories.AdvertisementRepository;

import java.util.List;
import java.util.UUID;

@Service
public class AdvertisementService {
    @Autowired
    private AdvertisementRepository advertisementRepository;

    public Advertisement saveAdvertisement(Advertisement advertisement) {
        return advertisementRepository.save(advertisement);
    }

    public List<Advertisement> getAdvertisements(UUID accountId) {
        return advertisementRepository.findByAccountId(accountId);
    }

    public Advertisement getSingleAdvertisement(UUID id){
        return advertisementRepository.findByid(id);
    }

}
