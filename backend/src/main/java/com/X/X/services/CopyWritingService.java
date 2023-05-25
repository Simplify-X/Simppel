package com.X.X.services;

import com.X.X.domains.CopyWriting;
import com.X.X.repositories.CopyWritingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class CopyWritingService {
    @Autowired
    private CopyWritingRepository copyWritingRepository;

    public CopyWriting saveCopy(CopyWriting copyWriting){
        return copyWritingRepository.save(copyWriting);
    }

    public List<CopyWriting> getCopyWriting(UUID accountId){
        return copyWritingRepository.findByAccountId(accountId);
    }

    public CopyWriting getSingleCopyWriting(UUID id){
        return copyWritingRepository.findByid(id);
    }
}
