from django.shortcuts import render
from django.views.generic import TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.mixins import UserPassesTestMixin
from django.views.generic import ListView, CreateView, UpdateView, DeleteView
from django.urls import reverse_lazy
from .models import Barang
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import JsonResponse
# Create your views here.

class OwnerRequiredMixin(UserPassesTestMixin):
    def test_func(self):
        return self.request.user.groups.filter(name='Owner').exists()

class HomeView(LoginRequiredMixin, TemplateView):
    template_name = "home.html"

# LIST (Owner & Staff boleh lihat)
class BarangListView(LoginRequiredMixin, ListView):
    model = Barang
    template_name = 'barang_list.html'
    context_object_name = 'barang_list'

# CREATE (Owner saja)
class BarangCreateView(LoginRequiredMixin, OwnerRequiredMixin, CreateView):
    model = Barang
    fields = ['nama', 'kategori', 'harga_beli', 'stok']
    template_name = 'barang_form.html'
    success_url = reverse_lazy('barang_list')

# UPDATE (Owner saja)
class BarangUpdateView(LoginRequiredMixin, OwnerRequiredMixin, UpdateView):
    model = Barang
    fields = ['nama', 'kategori', 'harga_beli', 'stok']
    template_name = 'barang_form.html'
    success_url = reverse_lazy('barang_list')

# DELETE (Owner saja)
class BarangDeleteView(LoginRequiredMixin, OwnerRequiredMixin, DeleteView):
    model = Barang
    template_name = 'barang_confirm_delete.html'
    success_url = reverse_lazy('barang_list')

def search_barang(request):
    query = request.GET.get('q')

    if query:
        barang = Barang.objects.filter(nama__icontains=query)
    else:
        barang = Barang.objects.all()

    data = []
    for b in barang:
        data.append({
            'id': b.id,
            'nama': b.nama,
            'kategori': b.kategori,
            'harga_beli': b.harga_beli,
            'stok': b.stok,
        })

    return JsonResponse({'barang': data})