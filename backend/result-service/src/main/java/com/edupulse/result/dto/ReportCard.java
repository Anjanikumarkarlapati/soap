package com.edupulse.result.dto;

import com.edupulse.result.model.Result;

import java.util.List;

public record ReportCard(StudentDto student, AttendanceSummaryDto attendance, List<Result> results) {
}
