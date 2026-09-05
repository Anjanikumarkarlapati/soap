package com.edupulse.attendance.controller;

import com.edupulse.attendance.client.StudentClient;
import com.edupulse.attendance.dto.AttendanceSummary;
import com.edupulse.attendance.model.Attendance;
import com.edupulse.attendance.repository.AttendanceRepository;
import feign.FeignException;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    private final AttendanceRepository attendanceRepository;
    private final StudentClient studentClient;

    public AttendanceController(AttendanceRepository attendanceRepository, StudentClient studentClient) {
        this.attendanceRepository = attendanceRepository;
        this.studentClient = studentClient;
    }

    @PostMapping
    public ResponseEntity<?> mark(@Valid @RequestBody Attendance attendance) {
        try {
            studentClient.getStudentById(attendance.getStudentId());
        } catch (FeignException.NotFound e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Student not found: " + attendance.getStudentId());
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(attendanceRepository.save(attendance));
    }

    @GetMapping("/student/{studentId}")
    public List<Attendance> getByStudent(@PathVariable Long studentId) {
        return attendanceRepository.findByStudentId(studentId);
    }

    @GetMapping("/student/{studentId}/summary")
    public AttendanceSummary summary(@PathVariable Long studentId) {
        List<Attendance> records = attendanceRepository.findByStudentId(studentId);
        long total = records.size();
        long present = records.stream().filter(a -> a.getStatus() == Attendance.Status.PRESENT).count();
        double percentage = total == 0 ? 0.0 : (present * 100.0) / total;
        return new AttendanceSummary(studentId, total, present, Math.round(percentage * 100.0) / 100.0);
    }
}
