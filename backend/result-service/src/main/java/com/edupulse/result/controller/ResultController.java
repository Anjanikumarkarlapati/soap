package com.edupulse.result.controller;

import com.edupulse.result.client.AttendanceClient;
import com.edupulse.result.client.StudentClient;
import com.edupulse.result.dto.ReportCard;
import com.edupulse.result.model.Result;
import com.edupulse.result.repository.ResultRepository;
import feign.FeignException;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/results")
public class ResultController {

    private final ResultRepository resultRepository;
    private final StudentClient studentClient;
    private final AttendanceClient attendanceClient;

    public ResultController(ResultRepository resultRepository, StudentClient studentClient, AttendanceClient attendanceClient) {
        this.resultRepository = resultRepository;
        this.studentClient = studentClient;
        this.attendanceClient = attendanceClient;
    }

    @PostMapping
    public ResponseEntity<?> addMarks(@Valid @RequestBody Result result) {
        try {
            studentClient.getStudentById(result.getStudentId());
        } catch (FeignException.NotFound e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Student not found: " + result.getStudentId());
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(resultRepository.save(result));
    }

    @GetMapping("/student/{studentId}")
    public List<Result> getByStudent(@PathVariable Long studentId) {
        return resultRepository.findByStudentId(studentId);
    }

    @GetMapping("/student/{studentId}/report-card")
    public ResponseEntity<?> reportCard(@PathVariable Long studentId) {
        try {
            var student = studentClient.getStudentById(studentId);
            var attendance = attendanceClient.getSummary(studentId);
            var results = resultRepository.findByStudentId(studentId);
            return ResponseEntity.ok(new ReportCard(student, attendance, results));
        } catch (FeignException.NotFound e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Student not found: " + studentId);
        }
    }
}
