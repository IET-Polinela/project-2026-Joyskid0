from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api_views import ReportViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from usermanagement_24782046.views import RegisterView

router = DefaultRouter()
router.register(r'reports', ReportViewSet, basename='report')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('', include(router.urls)),
]