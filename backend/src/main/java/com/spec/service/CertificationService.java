package com.spec.service;

import com.spec.domain.Certification;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service @RequiredArgsConstructor
public class CertificationService {

    private final CertificationRepository certificationRepository;

    public Certification createCertification(Certification certification) {
        return certificationRepository.save(certification);
    }

    public List<Certification> getAllCertifications() {
        return certificationRepository.findAll();
    }

    public Optional<Certification> getCertificationById(String id) {
        return certificationRepository.findById(id);
    }

    public Certification updateCertification(String id, Certification updatedCertification) {
        return certificationRepository.findById(id)
            .map(certification -> {
                certification.setName(updatedCertification.getName());
                certification.setIssuer(updatedCertification.getIssuer());
                certification.setIssueDate(updatedCertification.getIssueDate());
                certification.setExpiryDate(updatedCertification.getExpiryDate());
                certification.setDescription(updatedCertification.getDescription());
                return certificationRepository.save(certification);
            })
            .orElseThrow(() -> new RuntimeException("Certification not found with id " + id));
    }

    public void deleteCertification(String id) {
        certificationRepository.deleteById(id);
    }
}