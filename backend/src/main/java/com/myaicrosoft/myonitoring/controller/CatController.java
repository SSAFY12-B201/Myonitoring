package com.myaicrosoft.myonitoring.controller;

import lombok.RequiredArgsConstructor;
import com.myaicrosoft.myonitoring.model.dto.CatCreateRequest;
import com.myaicrosoft.myonitoring.model.dto.CatDetailResponseDto;
import com.myaicrosoft.myonitoring.model.dto.CatResponseDto;
import com.myaicrosoft.myonitoring.model.dto.CatUpdateRequest;
import com.myaicrosoft.myonitoring.model.entity.Cat;
import com.myaicrosoft.myonitoring.service.CatService;
import com.myaicrosoft.myonitoring.util.SecurityUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 고양이(Cat) 관련 요청을 처리하는 REST 컨트롤러 클래스
 */
@RestController
@RequestMapping("${app.api-prefix}/cats")
@RequiredArgsConstructor
public class CatController {

    private final CatService catService;
    private final SecurityUtil securityUtil;

    /**
     * 고양이 생성 API
     *
     * @param request 고양이 생성 요청 데이터 (DTO)
     * @return 생성된 고양이 엔티티
     */
    @PostMapping
    public ResponseEntity<Cat> createCat(@RequestBody CatCreateRequest request) {
        Long userId = securityUtil.getCurrentUserId();
        Cat cat = catService.createCat(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(cat);
    }

    /**
     * 특정 유저의 모든 고양이를 조회 API
     *
     * @return 유저와 연결된 고양이 목록 (DTO)
     */
    @GetMapping
    public ResponseEntity<List<CatResponseDto>> getCatsByUser() {
        Long userId = securityUtil.getCurrentUserId();
        List<CatResponseDto> cats = catService.getCatsByUserId(userId);
        return ResponseEntity.ok(cats);
    }

    /**
     * 특정 고양이를 조회 API
     *
     * @param catPk 고양이 ID (Primary Key)
     * @return 조회된 고양이 상세 정보 (DTO)
     */
    @GetMapping("/{catPk}")
    public ResponseEntity<CatDetailResponseDto> getCat(@PathVariable Long catPk) {
        CatDetailResponseDto cat = catService.getCatById(catPk);
        return ResponseEntity.ok(cat);
    }

    /**
     * 특정 고양이 정보를 수정 API
     *
     * @param catPk   수정할 고양이 ID (Primary Key)
     * @param request 수정 요청 데이터 (DTO)
     * @return 수정된 고양이 상세 정보 (DTO)
     */
    @PutMapping("/{catPk}")
    public ResponseEntity<CatDetailResponseDto> updateCat(
            @PathVariable Long catPk,
            @RequestBody CatUpdateRequest request) {
        CatDetailResponseDto updated = catService.updateCat(catPk, request);
        return ResponseEntity.ok(updated);
    }

    /**
     * 특정 고양이를 삭제 API
     *
     * @param catPk 삭제할 고양이 ID (Primary Key)
     * @return HTTP 204 상태 코드 반환
     */
    @DeleteMapping("/{catPk}")
    public ResponseEntity<Void> deleteCat(@PathVariable Long catPk) {
        catService.deleteCat(catPk);
        return ResponseEntity.noContent().build();
    }
}
