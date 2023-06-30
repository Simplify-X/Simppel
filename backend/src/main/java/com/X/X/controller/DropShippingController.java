package com.X.X.controller;

import com.X.X.domains.Advertisement;
import com.X.X.domains.DropshippingProduct;
import com.X.X.domains.Notification;
import com.X.X.domains.ProductTracker;
import com.X.X.dto.ResponseStatus;
import com.X.X.repositories.DropShippingProductRepository;
import com.X.X.repositories.NotificationRepository;
import com.X.X.repositories.ProductTrackerRepository;
import com.X.X.repositories.UserRepository;
import com.X.X.services.AdvertisementService;
import com.X.X.services.DropShippingService;
import com.X.X.services.NotificationService;
import com.X.X.services.ProductTrackerService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/dropshipping")
public class DropShippingController {
    @Autowired
    private DropShippingService dropShippingService;
    @Autowired
    private DropShippingProductRepository dropShippingProductRepository;

    @CrossOrigin
    @PostMapping
    @Operation(summary = "Add a Dropshipping Product", description = "Create and add a dropshipping product to users")
    public ResponseStatus createNotification(@RequestBody DropshippingProduct dropshippingProduct) {
        return dropShippingService.saveDropshippingProduct(dropshippingProduct);
    }

    @CrossOrigin
    @Operation(summary = "Update a Dropshipping product", description = "Update a dropshipping product based on ID")
    @PutMapping("/{id}")
    public ResponseStatus updateNotification(@PathVariable UUID id, @RequestBody DropshippingProduct dropshippingProduct) {
        return dropShippingService.updateDropShippingProduct(id, dropshippingProduct);
    }

    @CrossOrigin
    @Operation(summary = "Duplicate a Dropshipping product", description = "Duplicate a new dropshipping product")
    @PostMapping("/duplicate/{id}")
    public ResponseStatus duplicate(@PathVariable UUID id) {
        return dropShippingService.duplicateProduct(id);
    }

    @CrossOrigin
    @Operation(summary = "Get all dropshipping products", description = "Get and manage all dropshipping products ")
    @GetMapping
    public Iterable<DropshippingProduct> getNotification() {
        return dropShippingService.getDropshippingProduct();
    }

    @CrossOrigin
    @Operation(summary = "Get a singe dropshipping product", description = "Get a single dropshipping product based on Id")
    @GetMapping("/{id}")
    public DropshippingProduct getSingleNotification(@PathVariable UUID id) {
        return dropShippingService.getSingleDropShippingProduct(id);
    }

    @CrossOrigin
    @Operation(summary = "Delete dropshipping product", description = "Delete dropshipping product")
    @DeleteMapping("/delete/{id}")
    public ResponseStatus deleteProduct(@PathVariable UUID id) {
        return dropShippingService.deleteProduct(id);
    }
}
