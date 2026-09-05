package com.edupulse.attendance.dto;

public record AttendanceSummary(Long studentId, long totalClasses, long presentCount, double percentage) {
}
