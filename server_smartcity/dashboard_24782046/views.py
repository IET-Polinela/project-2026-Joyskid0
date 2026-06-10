from django.views.generic import TemplateView
from django.http import JsonResponse
from main_app.models import Report
from django.db.models import Count

class DashboardView(TemplateView):
    template_name = 'dashboard_24782046/dashboard.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['recent_reported'] = Report.objects.filter(status='REPORTED').order_by('-id')[:5]
        context['recent_resolved'] = Report.objects.filter(status='RESOLVED').order_by('-id')[:5]
        return context

def dashboard_data_api(request):
    """View khusus yang mengembalikan data dalam format JsonResponse """
    status_counts = Report.objects.values('status').annotate(total=Count('status'))
    category_counts = Report.objects.values('category').annotate(total=Count('category'))

    return JsonResponse({
        'status_labels': [s['status'] for s in status_counts],
        'status_counts': [s['total'] for s in status_counts],
        'category_labels': [c['category'] for c in category_counts],
        'category_counts': [c['total'] for c in category_counts],
    })