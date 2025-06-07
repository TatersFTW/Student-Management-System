from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from core.views import StudentViewSet, SubjectViewSet, GradeViewSet, index

router = DefaultRouter()
router.register(r'students', StudentViewSet)
router.register(r'subjects', SubjectViewSet)
router.register(r'grades', GradeViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('', index, name='index'),
]