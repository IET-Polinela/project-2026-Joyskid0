from rest_framework import serializers
from main_app.models import Report

class ReportSerializer(serializers.ModelSerializer):
    reporter = serializers.SerializerMethodField()
    is_owner = serializers.SerializerMethodField()

    class Meta:
        model = Report
        fields = [
            'id', 
            'title', 
            'category', 
            'description', 
            'location', 
            'status', 
            'reporter', 
            'is_owner',
            'created_at', 
            'updated_at'
        ]

    def get_reporter(self, obj):
        tab = self.context.get('tab', None)
        if tab == 'feed':
            return "Warga Anonim"
        return obj.reporter.username if obj.reporter else "Warga Anonim"

    def get_is_owner(self, obj):
        request = self.context.get('request')
        if request and request.user and request.user.is_authenticated:
            return obj.reporter == request.user
        return False