package com.myaicrosoft.myonitoring.service;

import lombok.RequiredArgsConstructor;
import com.myaicrosoft.myonitoring.model.entity.*;
import com.myaicrosoft.myonitoring.repository.*;
import com.myaicrosoft.myonitoring.model.dto.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 의료 기록(Medical) 관련 비즈니스 로직을 처리하는 서비스 클래스
 */
@Service
@RequiredArgsConstructor // final 필드에 대한 생성자를 자동으로 생성
public class MedicalService {

    private final MedicalRepository medicalRepository;
    private final CatRepository catRepository;

    /**
     * 의료 기록 생성 로직
     *
     * @param catId 고양이 ID (Primary Key)
     * @param request 의료 기록 생성 요청 데이터 (DTO)
     * @return 생성된 의료 기록의 ID 반환
     */
    public Long createMedicalRecord(Long catId, MedicalRequest request) {
        Cat cat = catRepository.findById(catId)
                .orElseThrow(() -> new IllegalArgumentException("해당 ID의 고양이를 찾을 수 없습니다. ID: " + catId));

        Medical medical = Medical.builder()
                .cat(cat)
                .category(request.getCategory())
                .title(request.getTitle())
                .description(request.getDescription())
                .hospitalName(request.getHospitalName())
                .visitDate(request.getVisitDate())
                .visitTime(request.getVisitTime())
                .build();

        return medicalRepository.save(medical).getId();
    }

    /**
     * 특정 기간의 의료 기록 조회 로직
     *
     * @param catId 고양이 ID (Primary Key)
     * @param startDate 조회 시작 날짜 (YYYY-MM-DD)
     * @param endDate 조회 종료 날짜 (YYYY-MM-DD)
     * @return 의료 기록 리스트 반환 (DTO)
     */
    public List<MedicalResponseDto> getMedicalRecords(Long catId, LocalDate startDate, LocalDate endDate) {
        List<Medical> records = medicalRepository.findByCatIdAndVisitDateBetween(catId, startDate, endDate);

        return records.stream()
                .map(record -> new MedicalResponseDto(
                        record.getId(),
                        record.getCategory(),
                        record.getTitle(),
                        record.getVisitDate(),
                        record.getVisitTime()
                ))
                .collect(Collectors.toList());
    }

    /**
     * 의료 기록 상세 조회 로직
     *
     * @param medicalId 의료 기록 ID (Primary Key)
     * @return 의료 기록 상세 정보 반환 (DTO)
     */
    public MedicalDetailResponseDto getMedicalRecordDetail(Long medicalId) {
        Medical medical = medicalRepository.findById(medicalId)
                .orElseThrow(() -> new IllegalArgumentException("해당 ID의 의료 기록을 찾을 수 없습니다. ID: " + medicalId));

        return new MedicalDetailResponseDto(
                medical.getId(),
                medical.getCategory(),
                medical.getTitle(),
                medical.getDescription(),
                medical.getHospitalName(),
                medical.getVisitDate(),
                medical.getVisitTime()
        );
    }

    /**
     * 의료 기록 수정 로직
     *
     * @param medicalId 수정할 의료 기록 ID (Primary Key)
     * @param request 수정 요청 데이터 (DTO)
     */
    public void updateMedicalRecord(Long medicalId, MedicalRequest request) {
        // 1. 의료 기록 조회
        Medical medical = medicalRepository.findById(medicalId)
                .orElseThrow(() -> new IllegalArgumentException("해당 ID의 의료 기록을 찾을 수 없습니다. ID: " + medicalId));

        // 2. 필수 필드 업데이트
        medical.setCategory(request.getCategory()); // 카테고리 업데이트
        medical.setTitle(request.getTitle());       // 제목 업데이트
        medical.setHospitalName(request.getHospitalName()); // 병원 이름 업데이트
        medical.setVisitDate(request.getVisitDate());       // 방문 날짜 업데이트
        medical.setVisitTime(request.getVisitTime());       // 방문 시간 업데이트

        // 3. 선택 필드 처리 (description)
        if (request.getDescription() == null) {
            // description이 요청에 포함되지 않은 경우 null 또는 빈 문자열로 설정
            medical.setDescription(null); // 또는 ""로 설정 가능: medical.setDescription("");
        } else {
            // description이 요청에 포함된 경우 해당 값으로 설정
            medical.setDescription(request.getDescription());
        }

        // 4. 저장 후 업데이트 완료 처리
        medicalRepository.save(medical);
    }

    /**
     * 의료 기록 삭제 로직
     *
     * @param medicalId 삭제할 의료 기록 ID (Primary Key)
     */
    public void deleteMedicalRecord(Long medicalId) {
        if (!medicalRepository.existsById(medicalId)) {
            throw new IllegalArgumentException("해당 ID의 의료 기록을 찾을 수 없습니다. ID: " + medicalId);
        }
        medicalRepository.deleteById(medicalId);
    }
}
