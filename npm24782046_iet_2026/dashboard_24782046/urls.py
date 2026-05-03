from django.urls import path
from .views import DashboardView, dashboard_data_api # Pastikan nama ini ada di views.py

app_name = 'dashboard'

urlpatterns = [
    path('', DashboardView.as_view(), name='index'),
    path('api/stats/', dashboard_data_api, name='api_data'),
]