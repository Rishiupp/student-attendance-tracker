It is a Java Spring Boot application that manages student records through REST APIs. It uses Spring Boot + Spring Data JPA + H2 database and follows the typical Controller → Service → Repository architecture.

What it does

You can perform:

POST /students → Add a student
GET /students → Get all students
GET /students/{id} → Get a student
PUT /students/{id} → Update a student
DELETE /students/{id} → Delete a student
Tech stack
Java
Spring Boot
Spring REST
Spring Data JPA
Hibernate
H2 Database
Maven
Project structure
src/main/java/
└── ...
    ├── controller/
    │   └── StudentController.java
    ├── service/
    │   └── StudentService.java
    ├── repository/
    │   └── StudentRepository.java
    ├── model/
    │   └── Student.java
    └── Application.java

HTTP Request → Controller → Service → Repository → Database
# student-attendance-tracker
