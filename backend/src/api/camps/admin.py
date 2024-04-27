from django.contrib import admin
from api.camps.models import Camp, CampFeature, CampImage, CampOccupancy

admin.site.register(Camp)
admin.site.register(CampFeature)
admin.site.register(CampImage)
admin.site.register(CampOccupancy)
