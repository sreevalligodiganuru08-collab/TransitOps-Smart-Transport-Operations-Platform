from django.contrib import admin
from .models import *

admin.site.register(Vehicle)
admin.site.register(Driver)
admin.site.register(Trip)
admin.site.register(Maintenance)
admin.site.register(FuelLog)
admin.site.register(Expense)