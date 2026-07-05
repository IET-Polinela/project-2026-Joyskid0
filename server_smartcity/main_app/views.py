from django.urls import reverse_lazy
from django.views.generic import ListView, CreateView, UpdateView, DeleteView, View
from django.shortcuts import get_object_or_404, redirect, render
from django.contrib import messages
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from .models import Report
from .forms import ReportForm
from django.http import JsonResponse
from django.core.exceptions import PermissionDenied

class AdminOnlyMixin(UserPassesTestMixin):
    def test_func(self):
        return self.request.user.is_authenticated and self.request.user.is_admin
    def handle_no_permission(self):
        messages.error(self.request, "Akses Ditolak: Fitur ini hanya untuk Admin.")
        return redirect('report_list')

def home_view(request): return render(request, 'main_app/home.html')
def about_view(request): return render(request, 'main_app/about.html')
def contact_view(request): return render(request, 'main_app/contact.html')

class ReportListView(LoginRequiredMixin, AdminOnlyMixin, ListView):
    model = Report
    template_name = 'main_app/report_list.html'
    context_object_name = 'reports'
    paginate_by = 10
    
    def get_queryset(self):
        queryset = super().get_queryset().order_by('-pk')
        status_filter = self.request.GET.get('status_filter', '')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        return queryset

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['status_filter'] = self.request.GET.get('status_filter', '')
        return context

class ReportCreateView(LoginRequiredMixin, AdminOnlyMixin, CreateView):
    model = Report
    form_class = ReportForm
    template_name = 'main_app/add_report.html'
    success_url = reverse_lazy('report_list')
    def form_valid(self, form):
        messages.success(self.request, "Laporan berhasil dikirim!")
        return super().form_valid(form)

class ReportUpdateView(LoginRequiredMixin, AdminOnlyMixin, UpdateView):
    model = Report
    form_class = ReportForm
    template_name = 'main_app/add_report.html'
    success_url = reverse_lazy('report_list')

    def get_object(self, queryset=None):
        obj = super().get_object(queryset)
        if obj.status != 'DRAFT':
            raise PermissionDenied("Laporan yang sudah diajukan tidak bisa diedit.")
        return obj

    def form_valid(self, form):
        messages.success(self.request, "Perubahan berhasil disimpan!")
        return super().form_valid(form)

class ReportDeleteView(LoginRequiredMixin, AdminOnlyMixin, DeleteView):
    model = Report
    template_name = 'main_app/delete_report.html'
    success_url = reverse_lazy('report_list')

    def get_object(self, queryset=None):
        obj = super().get_object(queryset)
        if obj.status != 'DRAFT':
            raise PermissionDenied("Laporan yang sudah diajukan tidak bisa dihapus.")
        return obj

ALLOWED_TRANSITIONS = {
    'DRAFT': ['REPORTED'],
    'REPORTED': ['VERIFIED'],
    'VERIFIED': ['IN_PROGRESS'],
    'IN_PROGRESS': ['RESOLVED'],
    'RESOLVED': [],  # status final, tidak ada transisi lanjutan
}

class ReportUpdateStatusView(LoginRequiredMixin, AdminOnlyMixin, View):
    def post(self, request, pk):
        report = get_object_or_404(Report, pk=pk)
        new_status = request.POST.get('status')

        if new_status and new_status in ALLOWED_TRANSITIONS.get(report.status, []):
            report.status = new_status
            report.save()
            messages.success(request, f"Status '{report.title}' sekarang {new_status}!")
        else:
            messages.error(request, f"Transisi status dari {report.status} ke {new_status} tidak valid.")

        return_url = request.META.get('HTTP_REFERER')
        if return_url:
            return redirect(return_url)
        return redirect('report_list')

def live_search_api(request):
    query = request.GET.get('q', '')
    reports = Report.objects.filter(title__icontains=query)
    results = [
        {'id': r.id, 'title': r.title, 'category': r.category, 'status': r.status}
        for r in reports
    ]
    return JsonResponse({'results': results})

def report_detail_api(request, pk):
    report = get_object_or_404(Report, pk=pk)
    data = {
        'title': report.title,
        'category': report.category,
        'description': report.description,
        'location': report.location,
        'status': report.status,
    }
    return JsonResponse(data)

from django.views.generic import DetailView
from django.http import HttpResponseForbidden

class ReportDetailView(LoginRequiredMixin, AdminOnlyMixin, DetailView):
    model = Report
    template_name = 'main_app/detail_report.html'
    context_object_name = 'report'


def report_search(request):
    if not (request.user.is_authenticated and request.user.is_admin):
        return HttpResponseForbidden("Akses ditolak.")

    query = request.GET.get('q', '')
    reports = Report.objects.filter(title__icontains=query)
    return render(request, 'main_app/report_list.html', {'reports': reports})