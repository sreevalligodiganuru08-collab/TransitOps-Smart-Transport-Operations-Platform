from .forms import *
from django.shortcuts import render, redirect, get_object_or_404
from .models import *


# -------------------------
# Authentication
# -------------------------

def login_page(request):
    return render(request, 'login.html')


def dashboard(request):

    context = {

        'vehicle_count': Vehicle.objects.count(),

        'driver_count': Driver.objects.count(),

        'trip_count': Trip.objects.count(),

        'maintenance_count': Maintenance.objects.count(),

        'expense_count': Expense.objects.count(),

    }

    return render(request, 'dashboard.html', context)


# -------------------------
# Vehicle CRUD
# -------------------------

def vehicle_list(request):
    vehicles = Vehicle.objects.all()

    return render(request, 'vehicles.html', {
        'vehicles': vehicles
    })


def add_vehicle(request):

    if request.method == "POST":

        Vehicle.objects.create(

            registration_number=request.POST['registration_number'],
            vehicle_name=request.POST['vehicle_name'],
            vehicle_type=request.POST['vehicle_type'],
            capacity=request.POST['capacity'],
            odometer=request.POST['odometer'],
            acquisition_cost=request.POST['acquisition_cost'],
            status=request.POST['status']

        )

        return redirect('vehicles')

    return render(request, 'vehicles.html')


def edit_vehicle(request, id):

    vehicle = get_object_or_404(Vehicle, id=id)

    if request.method == "POST":

        vehicle.registration_number = request.POST['registration_number']
        vehicle.vehicle_name = request.POST['vehicle_name']
        vehicle.vehicle_type = request.POST['vehicle_type']
        vehicle.capacity = request.POST['capacity']
        vehicle.odometer = request.POST['odometer']
        vehicle.acquisition_cost = request.POST['acquisition_cost']
        vehicle.status = request.POST['status']

        vehicle.save()

        return redirect('vehicles')

    return render(request, 'vehicles.html', {
        'vehicle': vehicle
    })


def delete_vehicle(request, id):

    vehicle = get_object_or_404(Vehicle, id=id)

    vehicle.delete()

    return redirect('vehicles')


# -------------------------
# Driver Placeholder
# -------------------------

def driver_list(request):

    drivers = Driver.objects.all()

    return render(request, 'drivers.html', {
        'drivers': drivers
    })


def add_driver(request):

    if request.method == "POST":

        Driver.objects.create(

            name=request.POST['name'],
            license_number=request.POST['license_number'],
            license_category=request.POST['license_category'],
            license_expiry=request.POST['license_expiry'],
            phone=request.POST['phone'],
            safety_score=request.POST['safety_score'],
            status=request.POST['status']

        )

        return redirect('drivers')

    return render(request, 'drivers.html')


def edit_driver(request, id):

    driver = get_object_or_404(Driver, id=id)

    if request.method == "POST":

        driver.name = request.POST['name']
        driver.license_number = request.POST['license_number']
        driver.license_category = request.POST['license_category']
        driver.license_expiry = request.POST['license_expiry']
        driver.phone = request.POST['phone']
        driver.safety_score = request.POST['safety_score']
        driver.status = request.POST['status']

        driver.save()

        return redirect('drivers')

    return render(request, 'drivers.html', {
        'driver': driver
    })


def delete_driver(request, id):

    driver = get_object_or_404(Driver, id=id)

    driver.delete()

    return redirect('drivers')


# -------------------------
# Trip Placeholder
# -------------------------

def trip_list(request):

    trips = Trip.objects.all()

    return render(request, 'trips.html', {
        'trips': trips
    })


# -------------------------
# Maintenance
# -------------------------

def maintenance_list(request):

    maintenance = Maintenance.objects.all()

    return render(request, 'maintenance.html', {
        'maintenance': maintenance
    })


# -------------------------
# Expense
# -------------------------

def expense_list(request):

    expenses = Expense.objects.all()

    return render(request, 'expenses.html', {
        'expenses': expenses
    })


# -------------------------
# Reports
# -------------------------

def reports(request):
    return render(request, 'reports.html')