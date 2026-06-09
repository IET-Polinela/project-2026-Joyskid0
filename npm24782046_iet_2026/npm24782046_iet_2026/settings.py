"""
Django settings for npm24782046_iet_2026 project.
"""

from pathlib import Path
from datetime import timedelta

# ==========================================
# BASE DIR
# ==========================================
BASE_DIR = Path(__file__).resolve().parent.parent


# ==========================================
# SECURITY
# ==========================================
SECRET_KEY = 'django-insecure-9c=(s3a5gx+-qxqgkl3h!x@co8d#)2=%mx_khok-hs0m2fy&g_'

DEBUG = True

ALLOWED_HOSTS = []


# ==========================================
# INSTALLED APPS
# ==========================================
INSTALLED_APPS = [

    # DJANGO
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # PROJECT APPS
    'main_app',
    'about',
    'contacts',
    'usermanagement_24782046',
    'dashboard_24782046',

    # THIRD PARTY
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
]


# ==========================================
# MIDDLEWARE
# ==========================================
MIDDLEWARE = [

    'corsheaders.middleware.CorsMiddleware',

    'django.middleware.security.SecurityMiddleware',

    'django.contrib.sessions.middleware.SessionMiddleware',

    'django.middleware.common.CommonMiddleware',

    'django.middleware.csrf.CsrfViewMiddleware',

    'django.contrib.auth.middleware.AuthenticationMiddleware',

    'django.contrib.messages.middleware.MessageMiddleware',

    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]


# ==========================================
# ROOT URL
# ==========================================
ROOT_URLCONF = 'npm24782046_iet_2026.urls'


# ==========================================
# TEMPLATE
# ==========================================
TEMPLATES = [
    {
        'BACKEND':
            'django.template.backends.django.DjangoTemplates',

        'DIRS':
            [BASE_DIR / 'templates'],

        'APP_DIRS':
            True,

        'OPTIONS': {
            'context_processors': [

                'django.template.context_processors.request',

                'django.contrib.auth.context_processors.auth',

                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]


# ==========================================
# WSGI
# ==========================================
WSGI_APPLICATION = 'npm24782046_iet_2026.wsgi.application'


# ==========================================
# DATABASE
# ==========================================
DATABASES = {
    'default': {

        'ENGINE':
            'django.db.backends.postgresql',

        'NAME':
            'iet_PI_db',

        'USER':
            'postgres',

        'PASSWORD':
            '177005',

        'HOST':
            'localhost',

        'PORT':
            '5432',
    }
}


# ==========================================
# PASSWORD VALIDATION
# ==========================================
AUTH_PASSWORD_VALIDATORS = [

    {
        'NAME':
            'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },

    {
        'NAME':
            'django.contrib.auth.password_validation.MinimumLengthValidator',
    },

    {
        'NAME':
            'django.contrib.auth.password_validation.CommonPasswordValidator',
    },

    {
        'NAME':
            'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# ==========================================
# CUSTOM USER
# ==========================================
AUTH_USER_MODEL = 'usermanagement_24782046.User'


# ==========================================
# LOGIN REDIRECT
# ==========================================
LOGIN_REDIRECT_URL = 'home'
LOGOUT_REDIRECT_URL = 'login'


# ==========================================
# INTERNATIONALIZATION
# ==========================================
LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# ==========================================
# STATIC FILES
# ==========================================
STATIC_URL = 'static/'


# ==========================================
# CORS
# ==========================================
CORS_ALLOW_ALL_ORIGINS = True


# ==========================================
# DJANGO REST FRAMEWORK
# ==========================================
REST_FRAMEWORK = {

    # JWT AUTH
    'DEFAULT_AUTHENTICATION_CLASSES': [

        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],

    # DEFAULT PERMISSION
    'DEFAULT_PERMISSION_CLASSES': [

        'rest_framework.permissions.IsAuthenticated',
    ],

    # RENDERER
    'DEFAULT_RENDERER_CLASSES': [

        'rest_framework.renderers.JSONRenderer',

        'rest_framework.renderers.BrowsableAPIRenderer',
    ],
}


# ==========================================
# SIMPLE JWT
# ==========================================
SIMPLE_JWT = {

    'ACCESS_TOKEN_LIFETIME':
        timedelta(hours=1),

    'REFRESH_TOKEN_LIFETIME':
        timedelta(days=1),

    'ROTATE_REFRESH_TOKENS':
        False,

    'BLACKLIST_AFTER_ROTATION':
        False,

    'UPDATE_LAST_LOGIN':
        False,
}