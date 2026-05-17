from django.contrib import admin
from .models import Report

@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ('title', 'status', 'category', 'created_at')
    list_filter = ('status',)
    search_fields = ('title',)