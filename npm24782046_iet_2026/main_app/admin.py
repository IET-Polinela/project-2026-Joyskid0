from django.contrib import admin
from .models import Report

@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    # Menampilkan kolom-kolom ini di daftar admin
    list_display = ('title', 'status', 'category', 'created_at')
    # Menambahkan filter di sisi kanan berdasarkan status
    list_filter = ('status',)
    # Menambahkan fitur pencarian berdasarkan judul
    search_fields = ('title',)