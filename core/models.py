from django.db import models


class Vehicle(models.Model):
    STATUS_CHOICES = [
        ('Available', 'Available'),
        ('In Transit', 'In Transit'),
        ('Maintenance', 'Maintenance'),
    ]

    registration_number = models.CharField(max_length=20, unique=True)
    vehicle_name = models.CharField(max_length=100)
    vehicle_type = models.CharField(max_length=50)
    capacity = models.IntegerField()
    odometer = models.FloatField()
    acquisition_cost = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Available')

    def __str__(self):
        return self.registration_number


class Driver(models.Model):
    STATUS_CHOICES = [
        ('Available', 'Available'),
        ('On Trip', 'On Trip'),
        ('Unavailable', 'Unavailable'),
    ]

    name = models.CharField(max_length=100)
    license_number = models.CharField(max_length=50, unique=True)
    license_category = models.CharField(max_length=20)
    license_expiry = models.DateField()
    phone = models.CharField(max_length=15)
    safety_score = models.FloatField(default=100)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Available')

    def __str__(self):
        return self.name


class Trip(models.Model):
    STATUS_CHOICES = [
        ('Scheduled', 'Scheduled'),
        ('Active', 'Active'),
        ('Completed', 'Completed'),
    ]

    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE)
    driver = models.ForeignKey(Driver, on_delete=models.CASCADE)

    source = models.CharField(max_length=100)
    destination = models.CharField(max_length=100)

    cargo_weight = models.FloatField()
    planned_distance = models.FloatField()

    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Scheduled')

    def __str__(self):
        return f"{self.source} → {self.destination}"


class Maintenance(models.Model):
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE)

    maintenance_type = models.CharField(max_length=100)
    maintenance_date = models.DateField()
    cost = models.DecimalField(max_digits=10, decimal_places=2)

    status = models.CharField(max_length=30)

    def __str__(self):
        return self.maintenance_type


class FuelLog(models.Model):
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE)

    fuel_litres = models.FloatField()
    fuel_cost = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField()

    def __str__(self):
        return self.vehicle.registration_number


class Expense(models.Model):
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE)

    expense_type = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField()

    def __str__(self):
        return self.expense_type