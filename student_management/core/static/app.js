const apiBaseUrl = 'http://127.0.0.1:8000/api/';

// Fetch and display students
async function loadStudents() {
    const response = await fetch(`${apiBaseUrl}students/`);
    const students = await response.json();
    const studentList = document.getElementById('studentList');
    const gradeStudent = document.getElementById('gradeStudent');
    studentList.innerHTML = '';
    gradeStudent.innerHTML = '<option value="">Select Student</option>';
    
    students.forEach(student => {
        const li = document.createElement('li');
        li.textContent = `${student.first_name} ${student.last_name} (${student.student_id})`;
        li.innerHTML += ` <button onclick="deleteStudent(${student.id})">Delete</button>`;
        studentList.appendChild(li);
        
        const option = document.createElement('option');
        option.value = student.id;
        option.textContent = `${student.first_name} ${student.last_name}`;
        gradeStudent.appendChild(option);
    });
}

// Fetch and display subjects
async function loadSubjects() {
    const response = await fetch(`${apiBaseUrl}subjects/`);
    const subjects = await response.json();
    const subjectList = document.getElementById('subjectList');
    const gradeSubject = document.getElementById('gradeSubject');
    subjectList.innerHTML = '';
    gradeSubject.innerHTML = '<option value="">Select Subject</option>';
    
    subjects.forEach(subject => {
        const li = document.createElement('li');
        li.textContent = `${subject.name} (${subject.code})`;
        li.innerHTML += ` <button onclick="deleteSubject(${subject.id})">Delete</button>`;
        subjectList.appendChild(li);
        
        const option = document.createElement('option');
        option.value = subject.id;
        option.textContent = subject.name;
        gradeSubject.appendChild(option);
    });
}

// Fetch and display grades
async function loadGrades() {
    const response = await fetch(`${apiBaseUrl}grades/`);
    const grades = await response.json();
    const gradeList = document.getElementById('gradeList');
    gradeList.innerHTML = '';
    
    grades.forEach(async grade => {
        const studentResponse = await fetch(`${apiBaseUrl}students/${grade.student}/`);
        const student = await studentResponse.json();
        const subjectResponse = await fetch(`${apiBaseUrl}subjects/${grade.subject}/`);
        const subject = await subjectResponse.json();
        
        const li = document.createElement('li');
        li.textContent = `${student.first_name} ${student.last_name} - ${subject.name}: Activity(${grade.activity_score}), Quiz(${grade.quiz_score}), Exam(${grade.exam_score})`;
        li.innerHTML += ` <button onclick="deleteGrade(${grade.id})">Delete</button>`;
        gradeList.appendChild(li);
    });
}

// Add a student
async function addStudent() {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const studentId = document.getElementById('studentId').value;
    const email = document.getElementById('email').value;
    
    await fetch(`${apiBaseUrl}students/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ first_name: firstName, last_name: lastName, student_id: studentId, email })
    });
    loadStudents();
}

// Add a subject
async function addSubject() {
    const name = document.getElementById('subjectName').value;
    const code = document.getElementById('subjectCode').value;
    
    await fetch(`${apiBaseUrl}subjects/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, code, students: [] })
    });
    loadSubjects();
}

// Add a grade
async function addGrade() {
    const student = document.getElementById('gradeStudent').value;
    const subject = document.getElementById('gradeSubject').value;
    const activityScore = document.getElementById('activityScore').value;
    const quizScore = document.getElementById('quizScore').value;
    const examScore = document.getElementById('examScore').value;
    
    await fetch(`${apiBaseUrl}grades/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student, subject, activity_score: activityScore, quiz_score: quizScore, exam_score: examScore })
    });
    loadGrades();
}

// Delete a student
async function deleteStudent(id) {
    await fetch(`${apiBaseUrl}students/${id}/`, { method: 'DELETE' });
    loadStudents();
}

// Delete a subject
async function deleteSubject(id) {
    await fetch(`${apiBaseUrl}subjects/${id}/`, { method: 'DELETE' });
    loadSubjects();
}

// Delete a grade
async function deleteGrade(id) {
    await fetch(`${apiBaseUrl}grades/${id}/`, { method: 'DELETE' });
    loadGrades();
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    loadStudents();
    loadSubjects();
    loadGrades();
});