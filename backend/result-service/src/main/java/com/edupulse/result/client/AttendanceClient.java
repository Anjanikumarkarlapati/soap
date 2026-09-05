package com.edupulse.result.client;

import com.edupulse.result.dto.AttendanceSummaryDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "ATTENDANCE-SERVICE", configuration = FeignAuthConfig.class)
public interface AttendanceClient {

    @GetMapping("/api/attendance/student/{studentId}/summary")
    AttendanceSummaryDto getSummary(@PathVariable("studentId") Long studentId);
}
