package com.X.X.services;

import com.X.X.domains.QrGenerator;
import com.X.X.dto.QrCodeGeneratorDto;
import com.X.X.repositories.QrGeneratorRepository;
import lombok.val;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class QrGeneratorService {
    @Autowired
    private QrGeneratorRepository qrGeneratorRepository;

    public QrGenerator saveQrGenerator(QrGenerator qrGenerator) {
        return qrGeneratorRepository.save(qrGenerator);
    }

    public List<QrGenerator> getQrGenerator(UUID accountId) {
        return qrGeneratorRepository.findByAccountId(accountId);
    }

    public QrGenerator getSingleQrRecord(UUID id){
        return qrGeneratorRepository.findByid(id);
    }

    public QrGenerator updateQrCode(UUID id, QrCodeGeneratorDto qrCodeGeneratorDto){

        val findQrCodeRecord = qrGeneratorRepository.findByid(id);
        findQrCodeRecord.setName(qrCodeGeneratorDto.getName());
        findQrCodeRecord.setDescription(qrCodeGeneratorDto.getDescription());
        findQrCodeRecord.setPrice(qrCodeGeneratorDto.getPrice());
        findQrCodeRecord.setClientEmail(qrCodeGeneratorDto.getClientEmail());
        findQrCodeRecord.setClientPhone(qrCodeGeneratorDto.getClientPhone());
        findQrCodeRecord.setClientWebsite(qrCodeGeneratorDto.getClientWebsite());
        findQrCodeRecord.setIndustry(qrCodeGeneratorDto.getIndustry());
        findQrCodeRecord.setLocation(qrCodeGeneratorDto.getLocation());
        findQrCodeRecord.setStatus(qrCodeGeneratorDto.getStatus());

        return this.qrGeneratorRepository.save(findQrCodeRecord);

    }

}
