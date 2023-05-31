package com.X.X.services;

import com.X.X.config.ResourceNotFoundException;
import com.X.X.domains.Advertisement;
import com.X.X.domains.ProductTracker;
import com.X.X.domains.TeamGroup;
import com.X.X.domains.TeamGroupMember;
import com.X.X.repositories.ProductTrackerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.X.X.repositories.AdvertisementRepository;

import java.util.List;
import java.util.UUID;

@Service
public class ProductTrackerService {
    @Autowired
    private ProductTrackerRepository productTrackerRepository;

    public ProductTracker saveProductTracker(ProductTracker productTracker) {
        return productTrackerRepository.save(productTracker);
    }

    public List<ProductTracker> getProductTracker(UUID accountId) {
        return productTrackerRepository.findByAccountId(accountId);
    }

    public ProductTracker getSingleProductTracker(UUID id){
        return productTrackerRepository.findByid(id);
    }

    public void deleteProduct(UUID id){
        ProductTracker productTracker = productTrackerRepository.findByid(id);

        productTrackerRepository.delete(productTracker);

    }


}
