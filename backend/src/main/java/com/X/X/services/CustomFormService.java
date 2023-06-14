package com.X.X.services;

import com.X.X.config.ResourceNotFoundException;
import com.X.X.domains.*;
import com.X.X.dto.ResponseStatus;
import com.X.X.help.Status;
import com.X.X.repositories.CustomFormRepository;
import com.X.X.repositories.TeamGroupMemberRepository;
import com.X.X.repositories.TeamGroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;


@Service
public class CustomFormService {
    @Autowired
    private CustomFormRepository customFormRepository;

    public CustomForm saveForm(CustomForm customForm) {
        return customFormRepository.save(customForm);
    }

    public List<CustomForm> getCustomForm(UUID accountId) {
        return customFormRepository.findByAccountId(accountId);
    }

    public CustomForm updateCustomForm(CustomForm customForm, UUID id) {
        CustomForm cf = customFormRepository.findByGroupId(id);

        if(cf == null){
            throw new ResourceNotFoundException("No Team Group found with : " + id);
        }
        cf.setFormType(CustomFormType.fromString(String.valueOf(customForm.getFormType())));
        cf.setFormName(customForm.getFormName());
        cf.setAccountId(cf.getAccountId());
        cf.setIsActive(customForm.getIsActive());

        return customFormRepository.save(cf);
    }


    public List<CustomForm> getAllCustomForm() {
        return customFormRepository.findAll();
    }

    public CustomForm getSingleCustomForm(UUID id) {
        return customFormRepository.findByGroupId(id);
    }

    public ResponseStatus deleteProduct(UUID id){
        try{
            CustomForm customForm = customFormRepository.findByGroupId(id);
            customFormRepository.delete(customForm);

            return new ResponseStatus(Status.OK, "Deleted");
        }
        catch (Exception e) {
            e.printStackTrace();
            return new ResponseStatus(Status.FAILED, "Failed to delete");
        }



    }


}
