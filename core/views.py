from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from .forms import *
from django.shortcuts import render, redirect, get_object_or_404
from .models import *


# -------------------------
# Authentication
# -------------------------

def login_page(request):

    if request.method == "POST":

        username = request.POST.get("username")
        password = request.POST.get("password")

        user = authenticate(
            request,
            username=username,
            password=password
        )

        if user:
            login(request, user)
            return redirect("dashboard")

    return render(request, "login.html")
def logout_user(request):

    logout(request)

    return redirect("login")

@login_required
def dashboard(request):
    context = {
    "vehicle_count": Vehicle.objects.count(),
    "driver_count": Driver.objects.count(),
    "trip_count": Trip.objects.count(),
    "maintenance_count": Maintenance.objects.count(),
    "fuel_count": FuelLog.objects.count(),
    "expense_count": Expense.objects.count(),

    "available_vehicles": Vehicle.objects.filter(status="Available").count(),
    "maintenance_vehicles": Vehicle.objects.filter(status="Maintenance").count(),

    "available_drivers": Driver.objects.filter(status="Available").count(),
    "busy_drivers": Driver.objects.filter(status="On Trip").count(),

    "active_trips": Trip.objects.filter(status="In Progress").count(),
    "completed_trips": Trip.objects.filter(status="Completed").count(),
}

    context["total_fuel_cost"] = sum(
    f.fuel_cost for f in FuelLog.objects.all())
    context["total_expense"] = sum(
    e.amount for e in Expense.objects.all()
)

    return render(request, "dashboard.html", context)


# -------------------------
# Vehicle CRUD
# -------------------------

@login_required
def vehicle_list(request):

    query = request.GET.get("search")

    if query:
        vehicles = Vehicle.objects.filter(
            vehicle_name__icontains=query
        )
    else:
        vehicles = Vehicle.objects.all()

    return render(request, "vehicles.html", {
        "vehicles": vehicles
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
        messages.success(request, "Vehicle added successfully.")

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
        messages.success(request, "Vehicle updated successfully.")

        return redirect('vehicles')

    return render(request, 'vehicles.html', {
        'vehicle': vehicle
    })


def delete_vehicle(request, id):

    vehicle = get_object_or_404(Vehicle, id=id)

    vehicle.delete()
    messages.success(request, "Vehicle deleted successfully.")

    return redirect('vehicles')


# -------------------------
# Driver Placeholder
# -------------------------
@login_required
def driver_list(request):

    query = request.GET.get("search")

    if query:
        drivers = Driver.objects.filter(
            name__icontains=query
        )
    else:
        drivers = Driver.objects.all()

    return render(request, "drivers.html", {
        "drivers": drivers
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
        messages.success(request, "Driver added successfully.")

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
        messages.success(request, "Driver updated successfully.")

        return redirect('drivers')

    return render(request, 'drivers.html', {
        'driver': driver
    })


def delete_driver(request, id):

    driver = get_object_or_404(Driver, id=id)

    driver.delete()
    messages.success(request, "Driver deleted successfully.")

    return redirect('drivers')


# -------------------------
# Trip Placeholder
# -------------------------

@login_required
def trip_list(request):

    trips = Trip.objects.all()

    return render(request, 'trips.html', {
        'trips': trips
    })


# -------------------------
# Maintenance
# -------------------------
@login_required
def maintenance_list(request):

    maintenance = Maintenance.objects.all()

    return render(request, 'maintenance.html', {
        'maintenance': maintenance
    })


@login_required
def add_maintenance(request):

    if request.method == "POST":

        Maintenance.objects.create(
            vehicle_id=request.POST["vehicle"],
            maintenance_type=request.POST["maintenance_type"],
            maintenance_date=request.POST["maintenance_date"],
            cost=request.POST["cost"],
            status=request.POST["status"],
        )
        messages.success(request, "Maintenance record added successfully.")

        return redirect("maintenance")

    return render(request, "maintenance.html")
@login_required
def edit_maintenance(request, id):

    maintenance = get_object_or_404(Maintenance, id=id)

    if request.method == "POST":
        maintenance.vehicle_id = request.POST["vehicle"]
        maintenance.maintenance_type = request.POST["maintenance_type"]
        maintenance.maintenance_date = request.POST["maintenance_date"]
        maintenance.cost = request.POST["cost"]
        maintenance.status = request.POST["status"]
        maintenance.save()

        return redirect("maintenance")

    return render(request, "maintenance.html", {
        "maintenance": maintenance
    })


@login_required
def delete_maintenance(request, id):

    Maintenance.objects.filter(id=id).delete()

    return redirect("maintenance")

# -------------------------
# Expense
# -------------------------
@login_required
def expense_list(request):

    expenses = Expense.objects.all()

    return render(request, 'expenses.html', {
        'expenses': expenses
    })

@login_required
def add_expense(request):

    if request.method == "POST":

        Expense.objects.create(
            vehicle_id=request.POST["vehicle"],
            expense_type=request.POST["expense_type"],
            amount=request.POST["amount"],
            date=request.POST["date"],
        )
        messages.success(request, "Expense added successfully.")

        return redirect("expenses")

    return render(request, "expenses.html")
@login_required
def edit_expense(request, id):

    expense = get_object_or_404(Expense, id=id)

    if request.method == "POST":
        expense.vehicle_id = request.POST["vehicle"]
        expense.expense_type = request.POST["expense_type"]
        expense.amount = request.POST["amount"]
        expense.date = request.POST["date"]
        expense.save()

        return redirect("expenses")

    return render(request, "expenses.html", {
        "expense": expense
    })


@login_required
def delete_expense(request, id):

    Expense.objects.filter(id=id).delete()

    return redirect("expenses")

# -------------------------
# Reports
# -------------------------

@login_required
def reports(request):

    vehicles = Vehicle.objects.all()
    drivers = Driver.objects.all()
    trips = Trip.objects.all()
    maintenance = Maintenance.objects.all()
    expenses = Expense.objects.all()

    total_expense = sum(
        float(exp.amount)
        for exp in expenses
    )

    context = {
        "vehicles": vehicles,
        "drivers": drivers,
        "trips": trips,
        "maintenance": maintenance,
        "expenses": expenses,
        "total_expense": total_expense,
    }

    return render(request, "reports.html", context)

@login_required
def add_trip(request):

    if request.method == "POST":

        Trip.objects.create(
            vehicle_id=request.POST["vehicle"],
            driver_id=request.POST["driver"],
            source=request.POST["source"],
            destination=request.POST["destination"],
            cargo_weight=request.POST["cargo_weight"],
            planned_distance=request.POST["planned_distance"],
            start_date=request.POST["start_date"],
            end_date=request.POST["end_date"],
            status=request.POST["status"],
        )
        messages.success(request, "Trip created successfully.")

        return redirect("trips")

    return render(request, "trips.html")

@login_required
def edit_trip(request, id):
    trip = get_object_or_404(Trip, id=id)

    if request.method == "POST":
        trip.vehicle_id = request.POST["vehicle"]
        trip.driver_id = request.POST["driver"]
        trip.source = request.POST["source"]
        trip.destination = request.POST["destination"]
        trip.cargo_weight = request.POST["cargo_weight"]
        trip.planned_distance = request.POST["planned_distance"]
        trip.start_date = request.POST["start_date"]
        trip.end_date = request.POST["end_date"]
        trip.status = request.POST["status"]
        trip.save()
        messages.success(request, "Trip updated successfully.")

        return redirect("trips")

    return render(request, "trips.html", {"trip": trip})

@login_required
def delete_trip(request, id):
    Trip.objects.filter(id=id).delete()
    messages.success(request, "Trip deleted successfully.")
    return redirect("trips")

@login_required
def fuel_list(request):

    fuel = FuelLog.objects.all()

    return render(request, "fuel.html", {
        "fuel": fuel
    })


@login_required
def add_fuel(request):

    if request.method == "POST":

        FuelLog.objects.create(
            vehicle_id=request.POST["vehicle"],
            fuel_litres=request.POST["fuel_litres"],
            fuel_cost=request.POST["fuel_cost"],
            date=request.POST["date"],
        )
        messages.success(request, "Fuel log added successfully.")

        return redirect("fuel")

    return render(request, "fuel.html")

@login_required
def edit_fuel(request, id):

    fuel = get_object_or_404(FuelLog, id=id)

    if request.method == "POST":
        fuel.vehicle_id = request.POST["vehicle"]
        fuel.fuel_litres = request.POST["fuel_litres"]
        fuel.fuel_cost = request.POST["fuel_cost"]
        fuel.date = request.POST["date"]
        fuel.save()

        return redirect("fuel")

    return render(request, "fuel.html", {
        "fuel": fuel
    })


@login_required
def delete_fuel(request, id):

    FuelLog.objects.filter(id=id).delete()

    return redirect("fuel")
