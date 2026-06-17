"""
URL configuration for npm24782046_iet_2026 project.

The urlpatterns list routes URLs to views.
"""

from django.contrib import admin
from django.urls import include, path

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
)

from django_scalar.views import scalar_viewer


urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),

    # Web Pages
    path('', include('main_app.urls')),
    path('about/', include('about.urls')),
    path('contacts/', include('contacts.urls')),
    path('dashboard/', include('dashboard_24782046.urls')),

    # API
    path('api/', include('main_app.api_urls')),

    # JWT Authentication
    path(
        'api/token/',
        TokenObtainPairView.as_view(),
        name='token_obtain_pair'
    ),
    path(
        'api/token/refresh/',
        TokenRefreshView.as_view(),
        name='token_refresh'
    ),

    # OpenAPI Schema
    path(
        'api/schema/',
        SpectacularAPIView.as_view(),
        name='schema'
    ),

    # Swagger UI
    path(
        'api/docs/swagger/',
        SpectacularSwaggerView.as_view(
            url_name='schema'
        ),
        name='swagger-ui'
    ),

    # Scalar UI
    path(
        'api/docs/scalar/',
        scalar_viewer,
        name='scalar-ui'
    ),
]