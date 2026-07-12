from django.shortcuts import render


def login_page(request):
    return render(request, 'login.html')


def dashboard(request):
    return render(request, 'dashboard.html')


def vehicles(request):
    return render(request, 'vehicles.html')


def drivers(request):
    return render(request, 'drivers.html')


def trips(request):
    return render(request, 'trips.html')


def maintenance(request):
    return render(request, 'maintenance.html')


def expenses(request):
    return render(request, 'expenses.html')


def reports(request):
    return render(request, 'reports.html')