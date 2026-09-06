package com.edupulse.auth;

import com.edupulse.auth.model.User;
import com.edupulse.auth.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DemoDataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DemoDataLoader(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) return;
        userRepository.save(new User("admin", passwordEncoder.encode("admin123"), "ADMIN"));
        userRepository.save(new User("faculty", passwordEncoder.encode("faculty123"), "FACULTY"));
    }
}
