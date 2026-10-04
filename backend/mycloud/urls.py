from django.contrib import admin
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.urls import path, include, re_path
from django.views.generic import TemplateView


urlpatterns = [
    # Django admin
    path('admin/', admin.site.urls),

    # DRF login/logout (для отладки через браузер)
    path('api/auth/', include('rest_framework.urls')),

    # Наш API
    path('api/', include('users.urls')),
    path('api/', include('storage.urls')),
]

# Отдача статики React в dev-режиме (DEBUG=True).
# Работает, потому что статика лежит в STATICFILES_DIRS.
urlpatterns += staticfiles_urlpatterns()

# SPA fallback — все остальные URL отдают index.html
urlpatterns += [
    re_path(r'^.*$', TemplateView.as_view(template_name='index.html')),
]
