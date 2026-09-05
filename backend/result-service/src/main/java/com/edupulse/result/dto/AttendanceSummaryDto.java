package com.edupulse.result.dto;

public record AttendanceSummaryDto(Long studentId, long totalClasses, long presentCount, double percentage) {
}
