package com.myaicrosoft.myonitoring.repository;

import com.myaicrosoft.myonitoring.model.entity.FcmToken;
import com.myaicrosoft.myonitoring.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FcmTokenRepository extends JpaRepository<FcmToken, Long> {
    Optional<FcmToken> findByToken(String token);
    Optional<FcmToken> findByUserAndIsActiveTrue(User user);
    List<FcmToken> findAllByIsActiveTrue();
} 