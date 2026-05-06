from django.db import models

# Create your models here.
from django.db import models

class Barang(models.Model):
    nama = models.CharField(max_length=100)
    kategori = models.CharField(max_length=100)
    harga_beli = models.IntegerField()
    stok = models.IntegerField()

    def __str__(self):
        return self.nama