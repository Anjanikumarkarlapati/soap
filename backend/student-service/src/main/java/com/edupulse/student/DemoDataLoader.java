package com.edupulse.student;

import com.edupulse.student.model.Student;
import com.edupulse.student.repository.StudentRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DemoDataLoader implements CommandLineRunner {

    private final StudentRepository studentRepository;

    public DemoDataLoader(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @Override
    public void run(String... args) {
        if (studentRepository.count() > 0) return;

        studentRepository.save(student("Ananya Sharma", "CS2025001", "CSE", 3, "ananya.sharma@edupulse.edu", "9821034567"));
        studentRepository.save(student("Rahul Mehta", "CS2025002", "CSE", 3, "rahul.mehta@edupulse.edu", "9834521098"));
        studentRepository.save(student("Priya Nair", "ECE2025010", "ECE", 5, "priya.nair@edupulse.edu", "9845632190"));
        studentRepository.save(student("Kabir Singh", "ME2025007", "ME", 1, "kabir.singh@edupulse.edu", "9856471203"));
        studentRepository.save(student("Fatima Sheikh", "CS2025003", "CSE", 3, "fatima.sheikh@edupulse.edu", "9867123450"));
        studentRepository.save(student("Arjun Iyer", "ECE2025011", "ECE", 5, "arjun.iyer@edupulse.edu", "9878345612"));
    }

    private Student student(String name, String roll, String dept, int semester, String email, String phone) {
        Student s = new Student();
        s.setName(name);
        s.setRollNumber(roll);
        s.setDepartment(dept);
        s.setSemester(semester);
        s.setEmail(email);
        s.setPhone(phone);
        return s;
    }
}
