package com.edupulse.result;

import com.edupulse.result.model.Result;
import com.edupulse.result.repository.ResultRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DemoDataLoader implements CommandLineRunner {

    private final ResultRepository resultRepository;

    public DemoDataLoader(ResultRepository resultRepository) {
        this.resultRepository = resultRepository;
    }

    @Override
    public void run(String... args) {
        if (resultRepository.count() > 0) return;

        String[] subjects = {"Data Structures", "Operating Systems", "Mathematics-III"};
        // ponytail: hand-picked marks, not random, so grades read as realistic rather than uniform
        double[][] marksByStudent = {
                {88, 74, 91}, {62, 58, 69}, {95, 89, 92},
                {41, 55, 38}, {77, 82, 66}, {73, 90, 84}
        };

        for (int i = 0; i < marksByStudent.length; i++) {
            long studentId = i + 1L;
            for (int j = 0; j < subjects.length; j++) {
                resultRepository.save(result(studentId, subjects[j], marksByStudent[i][j], 3));
            }
        }
    }

    private Result result(long studentId, String subject, double marks, int semester) {
        Result r = new Result();
        r.setStudentId(studentId);
        r.setSubject(subject);
        r.setMarks(marks);
        r.setSemester(semester);
        return r;
    }
}
