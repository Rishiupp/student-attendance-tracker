const API_URL = '/student';

document.addEventListener('DOMContentLoaded', () => {
    fetchStudents();
});

function updateStats(students) {
    // Total Students
    const totalStudents = students.length;
    document.getElementById('statTotalStudents').innerText = totalStudents;

    // Average GPA
    let totalGPA = 0;
    let countGPA = 0;
    const majorCount = {};
    
    students.forEach(s => {
        if (s.gpa) {
            totalGPA += parseFloat(s.gpa);
            countGPA++;
        }
        if (s.major) {
            majorCount[s.major] = (majorCount[s.major] || 0) + 1;
        }
    });

    const avgGPA = countGPA > 0 ? (totalGPA / countGPA).toFixed(2) : '0.00';
    document.getElementById('statAvgGPA').innerText = avgGPA;

    // Top Major
    let topMajor = '-';
    let maxCount = 0;
    for (const [major, count] of Object.entries(majorCount)) {
        if (count > maxCount) {
            maxCount = count;
            topMajor = major;
        }
    }
    document.getElementById('statTopMajor').innerText = topMajor;
}

function getGPABadgeClass(gpa) {
    if (!gpa) return 'badge-secondary';
    const val = parseFloat(gpa);
    if (val >= 3.5) return 'badge-success';
    if (val >= 2.5) return 'badge-info';
    return 'badge-warning';
}

function fetchStudents() {
    fetch(`${API_URL}/getAll`)
        .then(response => response.json())
        .then(data => {
            updateStats(data);
            
            const tableBody = document.getElementById('studentTableBody');
            tableBody.innerHTML = '';
            
            data.forEach((student, index) => {
                const row = document.createElement('tr');
                row.className = 'fade-in-up';
                row.style.animationDelay = `${index * 0.05}s`;
                
                const gpaClass = getGPABadgeClass(student.gpa);
                const majorText = student.major || '-';
                const majorHtml = student.major ? `<span class="badge badge-info">${majorText}</span>` : '-';
                const gpaHtml = student.gpa ? `<span class="badge ${gpaClass}">${student.gpa}</span>` : '-';

                row.innerHTML = `
                    <td>${student.id}</td>
                    <td><strong>${student.firstName} ${student.lastName}</strong></td>
                    <td>${student.email}</td>
                    <td>${majorHtml}</td>
                    <td>${gpaHtml}</td>
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
    const modal = document.getElementById('studentModal');
    modal.classList.add('show');
    if(modalId === 'addStudentModal') {
        document.getElementById('modalTitle').innerText = 'Add New Student';
        document.getElementById('studentForm').reset();
        document.getElementById('studentId').value = '';
    }
}

function closeModal() {
    document.getElementById('studentModal').classList.remove('show');
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
            showToast(id ? 'Student updated successfully!' : 'Student added successfully!', 'success');
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
            document.getElementById('studentModal').classList.add('show');
        })
        .catch(error => showToast('Error loading student', 'error'));
}

function deleteStudent(id) {
    if(confirm('Are you sure you want to delete this student?')) {
        fetch(`${API_URL}/delete/${id}`, { method: 'DELETE' })
            .then(response => {
                if(response.ok) {
                    showToast('Student deleted successfully!', 'success');
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
    toast.innerHTML = type === 'success' 
        ? `<i class="fa-solid fa-circle-check" style="color: var(--success)"></i> ${message}`
        : `<i class="fa-solid fa-circle-exclamation" style="color: var(--danger)"></i> ${message}`;
    
    toast.className = `toast show ${type}`;
    setTimeout(() => {
        toast.className = toast.className.replace('show', '');
    }, 3000);
}
