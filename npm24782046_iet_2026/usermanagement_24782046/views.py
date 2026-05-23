# usermanagement_24782046/views.py

from django.shortcuts import render, redirect
from django.contrib import messages
from .forms import CitizenRegistrationForm 

# --- TAMBAHAN UNTUK DRF API (SESUAI MODUL LAB 10) ---
from rest_framework import generics, permissions
from django.contrib.auth import get_user_model
from usermanagement_24782046.serializers import RegisterSerializer

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    """Implementasi Registrasi Citizen menggunakan Django REST Framework API"""
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny] # Dapat diakses oleh publik tanpa token
    serializer_class = RegisterSerializer


# --- KODE BAWAAN ASLI ANDA (TETAP DIPERTAHANKAN) ---
def register(request):
    """Implementasi Registrasi Citizen menggunakan Custom Form HTML"""
    if request.method == 'POST':
        form = CitizenRegistrationForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.is_admin = False 
            user.save()
            messages.success(request, "Registrasi berhasil! Silakan login.")
            return redirect('login')
    else:
        form = CitizenRegistrationForm()
    
    return render(request, 'registration/register.html', {'form': form})