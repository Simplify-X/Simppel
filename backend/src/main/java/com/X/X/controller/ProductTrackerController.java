package com.X.X.controller;

import com.X.X.domains.Advertisement;
import com.X.X.domains.ProductTracker;
import com.X.X.repositories.ProductTrackerRepository;
import com.X.X.repositories.UserRepository;
import com.X.X.services.AdvertisementService;
import com.X.X.services.ProductTrackerService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/product/tracker")
public class ProductTrackerController {
    @Autowired
    private ProductTrackerService productTrackerService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProductTrackerRepository productTrackerRepository;

    @CrossOrigin
    @PostMapping("/{id}")
    @Operation(summary = "Add a product to product tracker", description = "Create an advertisement for the specified user account.")
    public ProductTracker createProductTracker(@PathVariable UUID id, @RequestBody ProductTracker productTracker) {
        productTracker.setAccountId(id);
        return productTrackerService.saveProductTracker(productTracker);
    }

    @CrossOrigin
    @Operation(summary = "Get saved product", description = "Get all saved products for a user account")
    @GetMapping("/{accountId}")
    public List<ProductTracker> getProductTracker(@PathVariable UUID accountId) {
        return productTrackerService.getProductTracker(accountId);
    }

    @CrossOrigin
    @Operation(summary = "Get single product", description = "Get the details of a single product by ID.")
    @GetMapping("single/{id}")
    public ProductTracker getSingleProductTracker(@PathVariable UUID id) {
        return productTrackerService.getSingleProductTracker(id);
    }

    @CrossOrigin
    @Operation(summary = "Get saved product", description = "Get all saved products for a user account")
    @DeleteMapping("/delete/{id}")
    public void deleteProduct(@PathVariable UUID id) {
        productTrackerService.deleteProduct(id);
    }
}
