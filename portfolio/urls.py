from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('category/<str:category>/', views.category_view, name='category'),
] 