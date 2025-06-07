from django.shortcuts import render, redirect, get_object_or_404
from rest_framework import viewsets
from .models import Student, Subject, Grade
from .serializers import StudentSerializer, SubjectSerializer, GradeSerializer
from django.contrib import messages
from django.db.models import Q

def index(request):
    return render(request, 'index.html')

def student_list(request):
    query = request.GET.get('q', '')
    if query:
        students = Student.objects.filter(
            Q(first_name__icontains=query) |
            Q(last_name__icontains=query) |
            Q(student_id__icontains=query)
        )
    else:
        students = Student.objects.all()
    
    if request.method == 'POST':
        action = request.POST.get('action')
        if action == 'add':
            first_name = request.POST.get('first_name')
            last_name = request.POST.get('last_name')
            student_id = request.POST.get('student_id')
            email = request.POST.get('email')
            try:
                Student.objects.create(
                    first_name=first_name,
                    last_name=last_name,
                    student_id=student_id,
                    email=email
                )
                messages.success(request, 'Student added successfully.')
            except:
                messages.error(request, 'Error adding student.')
            return redirect('student_list')
    return render(request, 'student_list.html', {'students': students, 'query': query})

def subject_list(request):
    subjects = Subject.objects.all()
    if request.method == 'POST':
        action = request.POST.get('action')
        if action == 'add':
            name = request.POST.get('name')
            code = request.POST.get('code')
            try:
                Subject.objects.create(name=name, code=code)
                messages.success(request, 'Subject added successfully.')
            except:
                messages.error(request, 'Error adding subject.')
            return redirect('subject_list')
        elif action == 'update':
            subject_id = request.POST.get('subject_id')
            subject = get_object_or_404(Subject, id=subject_id)
            subject.name = request.POST.get('name')
            subject.code = request.POST.get('code')
            try:
                subject.save()
                messages.success(request, 'Subject updated successfully.')
            except:
                messages.error(request, 'Error updating subject.')
            return redirect('subject_list')
        elif action == 'delete':
            subject_id = request.POST.get('subject_id')
            subject = get_object_or_404(Subject, id=subject_id)
            subject.delete()
            messages.success(request, 'Subject deleted successfully.')
            return redirect('subject_list')
    return render(request, 'subject_list.html', {'subjects': subjects})

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