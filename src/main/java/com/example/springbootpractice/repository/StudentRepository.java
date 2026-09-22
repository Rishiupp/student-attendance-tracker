package com.example.springbootpractice.repository;

import com.example.springbootpractice.model.StudentModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentRepository extends JpaRepository<StudentModel, Integer> {
    List<StudentModel> findByMajor(String major);
    List<StudentModel> findByGpaGreaterThanEqualOrderByGpaDesc(Double gpa);
}
