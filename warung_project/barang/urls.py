from django.urls import path
from .views import *

urlpatterns = [
    path('barang/', BarangListView.as_view(), name='barang_list'),
    path('barang/tambah/', BarangCreateView.as_view(), name='barang_create'),
    path('barang/<int:pk>/edit/', BarangUpdateView.as_view(), name='barang_update'),
    path('barang/<int:pk>/hapus/', BarangDeleteView.as_view(), name='barang_delete'),
    path('search/', search_barang, name='search_barang'),
    path('chart-data/', chart_data, name='chart_data'),
]