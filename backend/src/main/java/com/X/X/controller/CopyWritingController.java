package com.X.X.controller;

import com.X.X.domains.AdvertisementAccess;
import com.X.X.domains.CopyWriting;
import com.X.X.domains.CopyWritingContext;
import com.X.X.domains.CopyWritingType;
import com.X.X.repositories.UserRepository;
import com.X.X.services.CopyWritingService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/copyWriting")
public class CopyWritingController {

    @Autowired
    private CopyWritingService copyWritingService;

    @Autowired
    private UserRepository userRepository;

    @CrossOrigin
    @PostMapping("/{id}")
    @Operation(summary = "Create copy writing", description = "Create a copy writing for the specific user")
    public CopyWriting createCopy(@PathVariable UUID id, @RequestBody CopyWriting copyWriting){
        copyWriting.setAccountId(id);

        if(copyWriting.getCopyWritingType() != null ){
            copyWriting.setCopyWritingType(CopyWritingType.fromString(String.valueOf(copyWriting.getCopyWritingType())));

        }

        if (copyWriting.getCopyWritingContext() != null) {
            CopyWritingContext context = copyWriting.getCopyWritingContext();

            copyWriting.setCopyWritingContext(context);
        }

        return copyWritingService.saveCopy(copyWriting);
    }

    @CrossOrigin
    @GetMapping("/{accountId}")
    @Operation(summary = "Create copy writing", description = "Get a list of all copy writing")
    public List<CopyWriting> getCopy(@PathVariable UUID accountId){
        return copyWritingService.getCopyWriting(accountId);
    }

    @CrossOrigin
    @GetMapping("/single/{id}")
    @Operation(summary = "Create copy writing", description = "Get a single copy based on the id")
    public CopyWriting getSingleCopy(@PathVariable UUID id){
        return copyWritingService.getSingleCopyWriting(id);
    }

}
