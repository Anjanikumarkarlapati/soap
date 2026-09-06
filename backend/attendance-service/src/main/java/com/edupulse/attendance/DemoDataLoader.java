package com.edupulse.attendance;

import com.edupulse.attendance.model.Attendance;
import com.edupulse.attendance.repository.AttendanceRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DemoDataLoader implements CommandLineRunner {

    private final AttendanceRepository attendanceRepository;

    public DemoDataLoader(AttendanceRepository attendanceRepository) {
        this.attendanceRepository = attendanceRepository;
    }

    @Override
    public void run(String... args) {
        if (attendanceRepository.count() > 0) return;

        String[] subjects = {"Data Structures", "Operating Systems", "Mathematics-III"};
        // ponytail: assumes fresh student-service seeded students 1-6; fine for demo data, not for prod re-seeding
        for (long studentId = 1; studentId <= 6; studentId++) {
            for (int day = 0; day < 5; day++) {
                LocalDate date = LocalDate.now().minusDays(day * 2L);
                String subject = subjects[day % subjects.length];
                Attendance.Status status = (studentId + day) % 4 == 0 ? Attendance.Status.ABSENT : Attendance.Status.PRESENT;
                attendanceRepository.save(record(studentId, date, subject, status));
            }
        }
    }

    private Attendance record(long studentId, LocalDate date, String subject, Attendance.Status status) {
        Attendance a = new Attendance();
        a.setStudentId(studentId);
        a.setDate(date);
        a.setSubject(subject);
        a.setStatus(status);
        return a;
    }
}
