from rest_framework import serializers
from main_app.models import Report

class ReportSerializer(serializers.ModelSerializer):
    reporter = serializers.SerializerMethodField()

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
            'created_at', 
            'updated_at'
        ]

    def get_reporter(self, obj):
        return "Warga Anonim"