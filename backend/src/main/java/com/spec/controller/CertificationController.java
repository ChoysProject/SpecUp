package com.spec.controller;   

import com.spec.domain.Certification;
import com.spec.service.CertificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController @RequestMapping("/api/certifications") @RequiredArgsConstructor
public class CertificationController {

    private final CertificationService certificationService;

    @PostMapping
    public ResponseEntity<Certification> createCertification(@RequestBody Certification certification) {
        Certification createdCert = certificationService.createCertification(certification);
        return new ResponseEntity<>(createdCert, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Certification>> getAllCertifications() {
        List<Certification> certifications = certificationService.getAllCertifications();
        return new ResponseEntity<>(certifications, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Certification> getCertificationById(@PathVariable String id) { // [변경] ID 타입 Long -> String
        Optional<Certification> certification = certificationService.getCertificationById(id);
        return certification.map(cert -> new ResponseEntity<>(cert, HttpStatus.OK))
                            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Certification> updateCertification(@PathVariable String id, @RequestBody Certification certification) { // [변경] ID 타입 Long -> String
        try {
            Certification updatedCert = certificationService.updateCertification(id, certification);
            return new ResponseEntity<>(updatedCert, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCertification(@PathVariable String id) { // [변경] ID 타입 Long -> String
        certificationService.deleteCertification(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}