from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render, redirect, get_object_or_404
from .models import Trip, Vehicle, Driver
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

    vehicles = Vehicle.objects.all()
    trips = Trip.objects.all().order_by('-id')[:5]

    context = {

        # Vehicle stats
        "vehicle_count": Vehicle.objects.count(),

        "available_vehicles":
            Vehicle.objects.filter(status="Available").count(),

        "maintenance_vehicles":
            Vehicle.objects.filter(status="Maintenance").count(),


        # Driver stats
        "driver_count":
            Driver.objects.count(),

        "busy_drivers":
            Driver.objects.filter(status="On Trip").count(),


        # Trip stats
        "trip_count":
            Trip.objects.count(),

        "active_trips":
            Trip.objects.filter(status="Ongoing").count(),


        # Expenses
        "expense_count":
            Expense.objects.count(),


        # Recent activity
        "recent_trips": trips,

    }


    return render(
        request,
        "dashboard.html",
        context
    )


# -------------------------
# Vehicle CRUD
# -------------------------

@login_required
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

@login_required
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

@login_required
def trip_list(request):

    context = {
        "trips": Trip.objects.all(),
        "vehicles": Vehicle.objects.filter(status="Available"),
        "drivers": Driver.objects.filter(status="Available"),
    }

<<<<<<< HEAD
    return render(request,"trips.html",context)
=======
    return render(request, 'trips.html', {
        'trips': trips,
        'vehicles': Vehicle.objects.all(),
        'drivers': Driver.objects.all(),
    })
>>>>>>> 5b98f44eabf571389fa792b27c0342d21238fc71


# -------------------------
# Maintenance
# -------------------------
@login_required
def maintenance_list(request):

    maintenance = Maintenance.objects.all().order_by("-id")
    vehicles = Vehicle.objects.all()

<<<<<<< HEAD
    return render(request, "maintenance.html", {
        "maintenance": maintenance,
        "vehicles": vehicles,
=======
    return render(request, 'maintenance.html', {
        'maintenance': maintenance,
        'vehicles': Vehicle.objects.all(),
>>>>>>> 5b98f44eabf571389fa792b27c0342d21238fc71
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

        return redirect("maintenance")

    return render(request, "maintenance.html", {
        "vehicles": Vehicle.objects.all(),
    })
@login_required
def edit_maintenance(request, id):

    maintenance = get_object_or_404(Maintenance, id=id)

    if request.method == "POST":

        maintenance.vehicle_id = request.POST.get("vehicle")
        maintenance.maintenance_type = request.POST.get("maintenance_type")
        maintenance.maintenance_date = request.POST.get("maintenance_date")
        maintenance.cost = request.POST.get("cost")

        status = request.POST.get("status")
        if status:
            maintenance.status = status

        maintenance.save()

        return redirect("maintenance")

    return render(request, "maintenance.html", {
<<<<<<< HEAD
        "maintenance": Maintenance.objects.all(),
        "vehicles": Vehicle.objects.all(),
        "edit_maintenance": maintenance,
=======
        "maintenance": maintenance,
        "maintenance_record": maintenance,
        "vehicles": Vehicle.objects.all(),
>>>>>>> 5b98f44eabf571389fa792b27c0342d21238fc71
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
        'expenses': expenses,
        'vehicles': Vehicle.objects.all(),
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

        return redirect("expenses")

    return render(request, "expenses.html", {
        "vehicles": Vehicle.objects.all(),
    })
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
        "expense": expense,
        "vehicles": Vehicle.objects.all(),
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
    fuel_logs = FuelLog.objects.all()

    total_expense = sum(
        float(exp.amount)
        for exp in expenses
    )

    total_fuel_litres = sum(float(f.fuel_litres) for f in fuel_logs)
    total_fuel_cost = sum(float(f.fuel_cost) for f in fuel_logs)
    total_maintenance_cost = sum(float(m.cost) for m in maintenance)
    total_planned_distance = sum(float(t.planned_distance) for t in trips)

    vehicle_count = vehicles.count()
    vehicles_in_transit_count = vehicles.filter(status="In Transit").count()

    fleet_utilization = round((vehicles_in_transit_count / vehicle_count * 100), 1) if vehicle_count else 0
    fuel_efficiency = round((total_planned_distance / total_fuel_litres), 1) if total_fuel_litres else 0
    operational_cost = total_maintenance_cost + total_fuel_cost

    context = {
        "vehicles": vehicles,
        "drivers": drivers,
        "trips": trips,
        "maintenance": maintenance,
        "expenses": expenses,
        "fuel_logs": fuel_logs,
        "total_expense": total_expense,
        "total_fuel_litres": total_fuel_litres,
        "total_fuel_cost": total_fuel_cost,
        "total_maintenance_cost": total_maintenance_cost,
        "total_planned_distance": total_planned_distance,
        "fleet_utilization": fleet_utilization,
        "fuel_efficiency": fuel_efficiency,
        "operational_cost": operational_cost,
        "vehicles_available_count": vehicles.filter(status="Available").count(),
        "vehicles_in_transit_count": vehicles_in_transit_count,
        "vehicles_maintenance_count": vehicles.filter(status="Maintenance").count(),
    }

    return render(request, "reports.html", context)
@login_required
def add_trip(request):

    vehicles = Vehicle.objects.all()
    drivers = Driver.objects.all()

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

        return redirect("trips")

<<<<<<< HEAD
=======
    return render(request, "trips.html", {
        "vehicles": Vehicle.objects.all(),
        "drivers": Driver.objects.all(),
    })
>>>>>>> 5b98f44eabf571389fa792b27c0342d21238fc71

    return render(request,"trips.html",{
        "vehicles":vehicles,
        "drivers":drivers
    })

from django.shortcuts import render, redirect, get_object_or_404
@login_required
def edit_trip(request, id):

    trip = get_object_or_404(Trip, id=id)

    if request.method == "POST":

        trip.source = request.POST.get("source")
        trip.destination = request.POST.get("destination")

        trip.vehicle = Vehicle.objects.get(
            id=request.POST.get("vehicle")
        )

        trip.driver = Driver.objects.get(
            id=request.POST.get("driver")
        )

        trip.cargo_weight = request.POST.get("cargo_weight")
        trip.planned_distance = request.POST.get("planned_distance")
        trip.start_date = request.POST.get("start_date")
        trip.end_date = request.POST.get("end_date")

        # Keep existing status if no status is sent from the form
        status = request.POST.get("status")
        if status:
            trip.status = status

        trip.save()

        return redirect("trips")

<<<<<<< HEAD
    return render(
        request,
        "trips.html",
        {
            "trips": Trip.objects.all(),
            "vehicles": Vehicle.objects.all(),
            "drivers": Driver.objects.all(),
            "edit_trip": trip,
        },
    )
=======
    return render(request, "trips.html", {
        "trip": trip,
        "vehicles": Vehicle.objects.all(),
        "drivers": Driver.objects.all(),
    })

>>>>>>> 5b98f44eabf571389fa792b27c0342d21238fc71
@login_required
def delete_trip(request, id):
    Trip.objects.filter(id=id).delete()
    return redirect("trips")
@login_required
def fuel_list(request):

    fuel = FuelLog.objects.all()

    return render(request, "fuel.html", {
        "fuel": fuel,
        "vehicles": Vehicle.objects.all(),
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

        return redirect("fuel")

    return render(request, "fuel.html", {
        "vehicles": Vehicle.objects.all(),
    })

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
        "fuel": fuel,
        "fuel_record": fuel,
        "vehicles": Vehicle.objects.all(),
    })


@login_required
def delete_fuel(request, id):

    FuelLog.objects.filter(id=id).delete()

    return redirect("fuel")
