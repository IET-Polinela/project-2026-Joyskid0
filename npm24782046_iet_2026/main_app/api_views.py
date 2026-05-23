from rest_framework import viewsets, permissions
from main_app.models import Report
from main_app.serializers import ReportSerializer
from main_app.permissions import IsOwnerAndDraftOrReadOnly

class ReportViewSet(viewsets.ModelViewSet):
    
    serializer_class = ReportSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Report.objects.all()
        return Report.objects.filter(reporter=user)

    def get_permissions(self):
        if self.action in ['update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), IsOwnerAndDraftOrReadOnly()]  
        return [permissions.IsAuthenticated()]
        
    def perform_create(self, serializer):
        serializer.save(reporter=self.request.user)