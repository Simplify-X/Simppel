package com.X.X.services;

import com.X.X.domains.AiTemplate;
import com.X.X.domains.CopyWriting;
import com.X.X.domains.Notification;
import com.X.X.domains.QrGenerator;
import com.X.X.dto.AITemplateDto;
import com.X.X.dto.QrCodeGeneratorDto;
import com.X.X.dto.ResponseStatus;
import com.X.X.help.Status;
import com.X.X.repositories.AiTemplateRepository;
import com.X.X.repositories.CopyWritingRepository;
import lombok.val;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class AiTemplateService {
    @Autowired
    private AiTemplateRepository aiTemplateRepository;

    public ResponseStatus saveAiTemplate(AiTemplate aiTemplate) {
        try {
            aiTemplateRepository.save(aiTemplate);
            return new ResponseStatus(Status.OK, "Added");
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseStatus(Status.FAILED, "Failed to save ai templates");
        }
    }

    public ResponseStatus getTemplatesForAdmin() {
        try {
            aiTemplateRepository.findAll();
            return new ResponseStatus(Status.OK, "Retrieved");
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseStatus(Status.FAILED, "Failed to retrieve ai templates");
        }
    }

    public AiTemplate updateAITemplate(UUID id, AITemplateDto aiTemplateDto){
        val findAITemplate = this.aiTemplateRepository.findByid(id);

        findAITemplate.setTemplateName(aiTemplateDto.getTemplateName());
        findAITemplate.setTemplateDescription(aiTemplateDto.getTemplateDescription());
        findAITemplate.setIsTemplateActive(aiTemplateDto.getIsTemplateActive());
        findAITemplate.setTemplateType(aiTemplateDto.getTemplateType());

        return this.aiTemplateRepository.save(findAITemplate);

    }

}
