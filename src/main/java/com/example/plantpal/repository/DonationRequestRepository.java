package com.example.plantpal.repository;

import com.example.plantpal.model.DonationRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DonationRequestRepository extends JpaRepository<DonationRequest, Long> {
}
