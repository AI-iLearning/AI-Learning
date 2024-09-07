from django.db import models

class Location(models.Model):
    contentid = models.CharField(max_length=100, unique=True)
    title = models.CharField(max_length=255)
    addr1 = models.CharField(max_length=255, blank=True, null=True)
    addr2 = models.CharField(max_length=255, blank=True, null=True)
    areacode = models.CharField(max_length=10, blank=True, null=True)
    sigungucode = models.CharField(max_length=10, blank=True, null=True)
    mapx = models.FloatField(blank=True, null=True)
    mapy = models.FloatField(blank=True, null=True)
    modifiedtime = models.DateTimeField(blank=True, null=True)
    firstimage = models.URLField(blank=True, null=True)
    firstimage2 = models.URLField(blank=True, null=True)
    cat1 = models.CharField(max_length=10, blank=True, null=True)
    cat2 = models.CharField(max_length=10, blank=True, null=True)
    cat3 = models.CharField(max_length=10, blank=True, null=True)
    contenttypeid = models.CharField(max_length=10, blank=True, null=True)

    def __str__(self):
        return self.title
