from django.shortcuts import render
from rest_framework import viewsets
from .models import Student, Subject, Grade
from .serializers import StudentSerializer, SubjectSerializer, GradeSerializer

def index(request):
    return render(request, 'index.html')

def student_profile(request, student_id):
    student = Student.objects.get(id=student_id)
    grades = Grade.objects.filter(student=student)
    return render(request, 'student_profile.html', {'student': student, 'grades': grades})

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

class SubjectViewSet(viewsets.ModelViewSet):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer

class GradeViewSet(viewsets.ModelViewSet):
    queryset = Grade.objects.all()
    serializer_class = GradeSerializer