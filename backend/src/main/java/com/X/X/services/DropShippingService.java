package com.X.X.services;

import com.X.X.domains.*;
import com.X.X.dto.ResponseStatus;
import com.X.X.help.Status;
import com.X.X.repositories.DropShippingProductRepository;
import com.X.X.repositories.NotificationRepository;
import lombok.val;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class DropShippingService {
    @Autowired
    private DropShippingProductRepository dropShippingProductRepository;

    public ResponseStatus saveDropshippingProduct(DropshippingProduct dropshippingProduct) {
        try {
            dropShippingProductRepository.save(dropshippingProduct);
            return new ResponseStatus(Status.OK, "Added");
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseStatus(Status.FAILED, "Failed to save notification");
        }
    }


    public Iterable<DropshippingProduct> getDropshippingProduct() {
        return dropShippingProductRepository.findAll();
    }

    public DropshippingProduct getSingleDropShippingProduct(UUID id) {
        return dropShippingProductRepository.findByid(id);
    }

    public ResponseStatus deleteProduct(UUID id){
        try{
            DropshippingProduct dropshippingProduct = dropShippingProductRepository.findByid(id);
            dropShippingProductRepository.delete(dropshippingProduct);

            return new ResponseStatus(Status.OK, "DropShipping deleted");
        }
        catch (Exception e) {
            e.printStackTrace();
            return new ResponseStatus(Status.FAILED, "Failed to delete dropshipping product");
        }



    }

    public ResponseStatus updateDropShippingProduct(UUID id, DropshippingProduct dropshippingProduct) {
        try {
            Optional<DropshippingProduct> exisitingDropShippingProduct = dropShippingProductRepository.findById(id);
            if (exisitingDropShippingProduct.isPresent()) {
                DropshippingProduct existingProduct = exisitingDropShippingProduct.get();
                existingProduct.setTitle(dropshippingProduct.getTitle());
                existingProduct.setDescription(dropshippingProduct.getDescription());
                existingProduct.setCategory(dropshippingProduct.getCategory());
                existingProduct.setDemand(dropshippingProduct.getDemand());
                existingProduct.setAnalytics(dropshippingProduct.getAnalytics());
                existingProduct.setPrice(dropshippingProduct.getPrice());
                existingProduct.setFacebookAds(dropshippingProduct.getFacebookAds());
                existingProduct.setSimilarItems(dropshippingProduct.getSimilarItems());
                existingProduct.setSuppliers(dropshippingProduct.getSuppliers());
                existingProduct.setTargeting(dropshippingProduct.getTargeting());
                existingProduct.setImage(dropshippingProduct.getImage());
                existingProduct.setProfitMargin(dropshippingProduct.getProfitMargin());
                existingProduct.setSaturation(dropshippingProduct.getSaturation());

                // Update other properties as needed

                dropShippingProductRepository.save(existingProduct);
                return new ResponseStatus(Status.OK, "Notification updated");
            } else {
                return new ResponseStatus(Status.FAILED, "Notification not found");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseStatus(Status.FAILED, "Failed to update notification");
        }
    }

    public ResponseStatus duplicateProduct(UUID id) {
        try {
            val getProduct = dropShippingProductRepository.findByid(id);

            if (getProduct != null) {
                // Create a new instance of the product
                DropshippingProduct duplicatedProduct = new DropshippingProduct(getProduct);
                // Save the duplicated product as a new record
                dropShippingProductRepository.save(duplicatedProduct);

                return new ResponseStatus(Status.OK, "Duplication Added");
            } else {
                return new ResponseStatus(Status.FAILED, "Failed to find product");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseStatus(Status.FAILED, "Failed to duplicate product");
        }
    }





}
