from django.shortcuts import render, redirect
from django.contrib import messages
from .forms import CitizenRegistrationForm 

def register(request):
    """Implementasi Registrasi Citizen menggunakan Custom Form"""
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