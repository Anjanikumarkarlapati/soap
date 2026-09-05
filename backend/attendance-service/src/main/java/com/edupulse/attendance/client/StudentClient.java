package com.edupulse.attendance.client;

import com.edupulse.attendance.dto.StudentDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "STUDENT-SERVICE", configuration = FeignAuthConfig.class)
public interface StudentClient {

    @GetMapping("/api/students/{id}")
    StudentDto getStudentById(@PathVariable("id") Long id);
}
