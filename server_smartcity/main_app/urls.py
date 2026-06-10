# main_app/urls.py
from django.urls import path
from django.contrib.auth import views as auth_views
from usermanagement_24782046 import views as user_views
from . import views

urlpatterns = [
    path('', views.home_view, name='home'),
    path('reports/', views.ReportListView.as_view(), name='report_list'),
    path('add/', views.ReportCreateView.as_view(), name='add_report'),
    path('update/<int:pk>/', views.ReportUpdateView.as_view(), name='update_report'),
    path('delete/<int:pk>/', views.ReportDeleteView.as_view(), name='delete_report'),
    path('status/<int:pk>/', views.ReportUpdateStatusView.as_view(), name='update_status'),
    path('login/', auth_views.LoginView.as_view(template_name='registration/login.html'), name='login'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('register/', user_views.register, name='register'),
    path('api/search/', views.live_search_api, name='api_search'),
    path('api/report/<int:pk>/', views.report_detail_api, name='api_report_detail'),
]