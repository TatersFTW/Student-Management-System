const apiBaseUrl = 'http://127.0.0.1:8000/api/';

// Get CSRF token from cookies
function getCsrfToken() {
    const name = 'csrftoken';
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Fetch and display students in dropdown
async function loadStudents() {
    try {
        const response = await fetch(`${apiBaseUrl}students/`);
        const students = await response.json();
        const gradeStudent = document.getElementById('gradeStudent');
        gradeStudent.innerHTML = '<option value="">Select Student</option>';
        
        students.forEach(student => {
            const option = document.createElement('option');
            option.value = student.id;
            option.textContent = `${student.first_name} ${student.last_name} (${student.student_id})`;
            gradeStudent.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading students:', error);
        alert('Error loading students');
    }
}

// Fetch and display subjects in dropdown
async function loadSubjects() {
    try {
        const response = await fetch(`${apiBaseUrl}subjects/`);
        const subjects = await response.json();
        const gradeSubject = document.getElementById('gradeSubject');
        gradeSubject.innerHTML = '<option value="">Select Subject</option>';
        
        subjects.forEach(subject => {
            const option = document.createElement('option');
            option.value = subject.id;
            option.textContent = `${subject.name} (${subject.code})`;
            gradeSubject.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading subjects:', error);
        alert('Error loading subjects');
    }
}

// Fetch and display grades
async function loadGrades() {
    try {
        const response = await fetch(`${apiBaseUrl}grades/`);
        const grades = await response.json();
        const gradeList = document.getElementById('gradeList');
        gradeList.innerHTML = '';
        
        for (const grade of grades) {
            const studentResponse = await fetch(`${apiBaseUrl}students/${grade.student}/`);
            const student = await studentResponse.json();
            const subjectResponse = await fetch(`${apiBaseUrl}subjects/${grade.subject}/`);
            const subject = await subjectResponse.json();
            
            const li = document.createElement('li');
            li.textContent = `${student.first_name} ${student.last_name} - ${subject.name}: Activity(${grade.activity_score}), Quiz(${grade.quiz_score}), Exam(${grade.exam_score})`;
            li.innerHTML += ` <button class="delete-btn" onclick="if(confirm('Are you sure you want to delete this grade?')) deleteGrade(${grade.id})">Delete</button>`;
            gradeList.appendChild(li);
        }
    } catch (error) {
        console.error('Error loading grades:', error);
        alert('Error loading grades');
    }
}

// Add a student
async function addStudent() {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const studentId = document.getElementById('studentId').value;
    const email = document.getElementById('email').value;
    
    if (!firstName || !lastName || !studentId || !email) {
        alert('Please fill in all fields');
        return;
    }
    
    try {
        const response = await fetch(`${apiBaseUrl}students/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCsrfToken()
            },
            body: JSON.stringify({ first_name: firstName, last_name: lastName, student_id: studentId, email })
        });
        if (response.ok) {
            document.getElementById('firstName').value = '';
            document.getElementById('lastName').value = '';
            document.getElementById('studentId').value = '';
            document.getElementById('email').value = '';
            loadStudents(); // Refresh student dropdown
            alert('Student added successfully');
        } else {
            alert('Error adding student');
        }
    } catch (error) {
        console.error('Error adding student:', error);
        alert('Error adding student');
    }
}

// Add a grade
async function addGrade() {
    const student = document.getElementById('gradeStudent').value;
    const subject = document.getElementById('gradeSubject').value;
    const activityScore = document.getElementById('activityScore').value;
    const quizScore = document.getElementById('quizScore').value;
    const examScore = document.getElementById('examScore').value;
    
    if (!student || !subject || !activityScore || !quizScore || !examScore) {
        alert('Please fill in all fields');
        return;
    }
    
    try {
        const response = await fetch(`${apiBaseUrl}grades/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCsrfToken()
            },
            body: JSON.stringify({ 
                student, 
                subject, 
                activity_score: parseFloat(activityScore), 
                quiz_score: parseFloat(quizScore), 
                exam_score: parseFloat(examScore) 
            })
        });
        if (response.ok) {
            document.getElementById('gradeStudent').value = '';
            document.getElementById('gradeSubject').value = '';
            document.getElementById('activityScore').value = '';
            document.getElementById('quizScore').value = '';
            document.getElementById('examScore').value = '';
            loadGrades();
            alert('Grade added successfully');
        } else {
            alert('Error adding grade');
        }
    } catch (error) {
        console.error('Error adding grade:', error);
        alert('Error adding grade');
    }
}

// Delete a grade
async function deleteGrade(id) {
    try {
        const response = await fetch(`${apiBaseUrl}grades/${id}/`, { 
            method: 'DELETE',
            headers: {
                'X-CSRFToken': getCsrfToken()
            }
        });
        if (response.ok) {
            loadGrades();
            alert('Grade deleted successfully');
        } else {
            alert('Error deleting grade');
        }
    } catch (error) {
        console.error('Error deleting grade:', error);
        alert('Error deleting grade');
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    loadStudents();
    loadSubjects();
    loadGrades();
});