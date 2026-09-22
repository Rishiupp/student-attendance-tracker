package com.example.springbootpractice.service;

import com.example.springbootpractice.model.StudentModel;
import com.example.springbootpractice.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StudentService {
    @Autowired
    StudentRepository studentRepository;
    public void createStudent(StudentModel studentModel) {
        studentRepository.save(studentModel); // save() method (CRUD operation) lies in JPA repository
    }

    public void addStudents(List<StudentModel> studentList) {
        studentRepository.saveAll(studentList);
    }

    public List<StudentModel> getStudents() {
        return studentRepository.findAll();
    }

    public StudentModel getStudent(int id) {
        return studentRepository.findById(id).orElse(null);
    }

    public void deleteStudent(int id) {
        studentRepository.deleteById(id);
    }

    public boolean updateStudent(int id, StudentModel studentModel) {
        boolean idFound = false;
        StudentModel oldData = null;
        Optional<StudentModel> optional = studentRepository.findById(id);

        if (optional.isPresent()) {
            idFound = true;
            oldData = optional.get();
            if (studentModel.getFirstName() != null) {
                oldData.setFirstName(studentModel.getFirstName());
            }
            if (studentModel.getLastName() != null) {
                oldData.setLastName(studentModel.getLastName());
            }
            if (studentModel.getEmail() != null) {
                oldData.setEmail(studentModel.getEmail());
            }
            if (studentModel.getAddress() != null) {
                oldData.setAddress(studentModel.getAddress());
            }
            if (studentModel.getAge() > 0) {
                oldData.setAge(studentModel.getAge());
            }
            if (studentModel.getMajor() != null) {
                oldData.setMajor(studentModel.getMajor());
            }
            if (studentModel.getGpa() != null) {
                oldData.setGpa(studentModel.getGpa());
            }

            studentRepository.save(oldData);
        }

        return idFound;
    }

    public List<StudentModel> getStudentsByMajor(String major) {
        return studentRepository.findByMajor(major);
    }

    public List<StudentModel> getTopStudents(Double minGpa) {
        return studentRepository.findByGpaGreaterThanEqualOrderByGpaDesc(minGpa);
    }
}
