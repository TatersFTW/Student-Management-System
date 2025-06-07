from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from core.views import StudentViewSet, SubjectViewSet, GradeViewSet, index, student_list, subject_list, student_profile

router = DefaultRouter()
router.register(r'students', StudentViewSet)
router.register(r'subjects', SubjectViewSet)
router.register(r'grades', GradeViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('', index, name='index'),
    path('students/', student_list, name='student_list'),
    path('subjects/', subject_list, name='subject_list'),
    path('student/<int:student_id>/', student_profile, name='student_profile'),
]