from django.urls import path
from . import views

urlpatterns = [
    path('', views.ReportListView.as_view(), name='home'),
    # Halaman Reports khusus [cite: 45]
    path('reports/', views.ReportListView.as_view(), name='report_list'), 
    
    path('detail/<int:pk>/', views.ReportDetailView.as_view(), name='detail_report'),
    path('add/', views.ReportCreateView.as_view(), name='add_report'),
    path('update/<int:pk>/', views.ReportUpdateView.as_view(), name='update_report'),
    path('delete/<int:pk>/', views.ReportDeleteView.as_view(), name='delete_report'),
    path('status/<int:pk>/', views.ReportUpdateStatusView.as_view(), name='update_status'),
]