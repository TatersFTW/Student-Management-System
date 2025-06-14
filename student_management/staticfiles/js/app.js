const apiBaseUrl = 'http://127.0.0.1:8000/api/';

// Fetch and filter students based on search input
async function searchStudents() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const searchResults = document.getElementById('searchResults');
    searchResults.innerHTML = '';

    if (!query) {
        return; // Clear results and exit if query is empty
    }

    try {
        const response = await fetch(`${apiBaseUrl}students/`);
        const students = await response.json();
        
        const filteredStudents = students.filter(student => 
            student.first_name.toLowerCase().includes(query) ||
            student.last_name.toLowerCase().includes(query) ||
            student.student_id.toLowerCase().includes(query)
        );

        if (filteredStudents.length === 0) {
            searchResults.innerHTML = '<li>No students found.</li>';
            return;
        }

        filteredStudents.forEach(student => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="/student/${student.id}/">${student.first_name} ${student.last_name} (${student.student_id})</a>`;
            searchResults.appendChild(li);
        });
    } catch (error) {
        console.error('Error searching students:', error);
        searchResults.innerHTML = '<li>Error loading students.</li>';
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', searchStudents);
});