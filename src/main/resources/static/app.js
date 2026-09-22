const API_URL = '/student';

document.addEventListener('DOMContentLoaded', () => {
    fetchStudents();
});

function fetchStudents() {
    fetch(`${API_URL}/getAll`)
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('studentTableBody');
            tableBody.innerHTML = '';
            
            data.forEach(student => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${student.id}</td>
                    <td>${student.firstName} ${student.lastName}</td>
                    <td>${student.email}</td>
                    <td>${student.major || '-'}</td>
                    <td>${student.gpa || '-'}</td>
                    <td>${student.age}</td>
                    <td>${student.address}</td>
                    <td class="actions">
                        <button class="btn-icon" onclick="editStudent(${student.id})"><i class="fa-solid fa-pen"></i></button>
                        <button class="btn-icon delete" onclick="deleteStudent(${student.id})"><i class="fa-solid fa-trash"></i></button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => showToast('Error fetching students', 'error'));
}

function openModal(modalId) {
    document.getElementById('studentModal').style.display = 'flex';
    if(modalId === 'addStudentModal') {
        document.getElementById('modalTitle').innerText = 'Add New Student';
        document.getElementById('studentForm').reset();
        document.getElementById('studentId').value = '';
    }
}

function closeModal() {
    document.getElementById('studentModal').style.display = 'none';
}

function saveStudent() {
    const id = document.getElementById('studentId').value;
    const student = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        major: document.getElementById('major').value,
        gpa: parseFloat(document.getElementById('gpa').value),
        age: parseInt(document.getElementById('age').value),
        address: document.getElementById('address').value
    };

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/update/${id}` : `${API_URL}/addStudent`;

    fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(student)
    })
    .then(response => {
        if(response.ok) {
            showToast(id ? 'Student updated!' : 'Student added!', 'success');
            closeModal();
            fetchStudents();
        } else {
            showToast('Failed to save student', 'error');
        }
    })
    .catch(error => showToast('Error saving student', 'error'));
}

function editStudent(id) {
    fetch(`${API_URL}/get/${id}`)
        .then(response => response.json())
        .then(student => {
            document.getElementById('studentId').value = student.id;
            document.getElementById('firstName').value = student.firstName;
            document.getElementById('lastName').value = student.lastName;
            document.getElementById('email').value = student.email;
            document.getElementById('major').value = student.major || '';
            document.getElementById('gpa').value = student.gpa || '';
            document.getElementById('age').value = student.age;
            document.getElementById('address').value = student.address;
            
            document.getElementById('modalTitle').innerText = 'Edit Student';
            document.getElementById('studentModal').style.display = 'flex';
        })
        .catch(error => showToast('Error loading student', 'error'));
}

function deleteStudent(id) {
    if(confirm('Are you sure you want to delete this student?')) {
        fetch(`${API_URL}/delete/${id}`, { method: 'DELETE' })
            .then(response => {
                if(response.ok) {
                    showToast('Student deleted!', 'success');
                    fetchStudents();
                } else {
                    showToast('Failed to delete student', 'error');
                }
            })
            .catch(error => showToast('Error deleting student', 'error'));
    }
}

function showToast(message, type) {
    const toast = document.getElementById('toast');
    toast.innerText = message;
    toast.className = `toast show ${type}`;
    setTimeout(() => {
        toast.className = toast.className.replace('show', '');
    }, 3000);
}
