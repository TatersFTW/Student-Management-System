from django.shortcuts import render, redirect, get_object_or_404
from rest_framework import viewsets
from .models import Student, Subject, Grade
from .serializers import StudentSerializer, SubjectSerializer, GradeSerializer
from django.contrib import messages

def index(request):
    return render(request, 'index.html')

def student_list(request):
    students = Student.objects.all()
    return render(request, 'student_list.html', {'students': students})

def student_profile(request, student_id):
    student = get_object_or_404(Student, id=student_id)
    grades = Grade.objects.filter(student=student)
    subjects = Subject.objects.all()

    if request.method == 'POST':
        action = request.POST.get('action')
        if action == 'update':
            student.first_name = request.POST.get('first_name')
            student.last_name = request.POST.get('last_name')
            student.student_id = request.POST.get('student_id')
            student.email = request.POST.get('email')
            try:
                student.save()
                messages.success(request, 'Student profile updated successfully.')
            except:
                messages.error(request, 'Error updating student profile.')
            return redirect('student_profile', student_id=student.id)
        elif action == 'delete':
            student.delete()
            messages.success(request, 'Student profile deleted successfully.')
            return redirect('student_list')
        elif action == 'update_grades':
            grade_id = request.POST.get('grade_id')
            grade = get_object_or_404(Grade, id=grade_id, student=student)
            grade.activity_score = float(request.POST.get('activity_score', 0))
            grade.quiz_score = float(request.POST.get('quiz_score', 0))
            grade.exam_score = float(request.POST.get('exam_score', 0))
            grade.save()
            messages.success(request, 'Grade updated successfully.')
            return redirect('student_profile', student_id=student.id)
        elif action == 'add_grade':
            subject_id = request.POST.get('subject_id')
            subject = get_object_or_404(Subject, id=subject_id)
            Grade.objects.create(
                student=student,
                subject=subject,
                activity_score=float(request.POST.get('activity_score', 0)),
                quiz_score=float(request.POST.get('quiz_score', 0)),
                exam_score=float(request.POST.get('exam_score', 0))
            )
            messages.success(request, 'Grade added successfully.')
            return redirect('student_profile', student_id=student.id)
        elif action == 'delete_grade':
            grade_id = request.POST.get('grade_id')
            grade = get_object_or_404(Grade, id=grade_id, student=student)
            grade.delete()
            messages.success(request, 'Grade deleted successfully.')
            return redirect('student_profile', student_id=student.id)
        elif action == 'add_subject':
            subject_id = request.POST.get('subject_id')
            subject = get_object_or_404(Subject, id=subject_id)
            subject.students.add(student)
            messages.success(request, 'Subject added successfully.')
            return redirect('student_profile', student_id=student.id)
        elif action == 'remove_subject':
            subject_id = request.POST.get('subject_id')
            subject = get_object_or_404(Subject, id=subject_id)
            subject.students.remove(student)
            Grade.objects.filter(student=student, subject=subject).delete()
            messages.success(request, 'Subject removed successfully.')
            return redirect('student_profile', student_id=student.id)

    return render(request, 'student_profile.html', {
        'student': student,
        'grades': grades,
        'subjects': subjects,
        'all_subjects': Subject.objects.all()
    })

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

class SubjectViewSet(viewsets.ModelViewSet):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer

class GradeViewSet(viewsets.ModelViewSet):
    queryset = Grade.objects.all()
    serializer_class = GradeSerializer