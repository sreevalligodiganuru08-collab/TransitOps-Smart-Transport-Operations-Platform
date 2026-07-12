from django.urls import path
from . import views

urlpatterns = [
    path('', views.login_page, name='login'),

    path('dashboard/', views.dashboard, name='dashboard'),

    path('vehicles/', views.vehicle_list, name='vehicles'),
    path('vehicles/add/', views.add_vehicle, name='add_vehicle'),
    path('vehicles/edit/<int:id>/', views.edit_vehicle, name='edit_vehicle'),
    path('vehicles/delete/<int:id>/', views.delete_vehicle, name='delete_vehicle'),

    # Driver
path('drivers/', views.driver_list, name='drivers'),
path('drivers/add/', views.add_driver, name='add_driver'),
path('drivers/edit/<int:id>/', views.edit_driver, name='edit_driver'),
path('drivers/delete/<int:id>/', views.delete_driver, name='delete_driver'),

# Trip
path('trips/', views.trip_list, name='trips'),
path('trips/add/', views.add_trip, name='add_trip'),
path('trips/edit/<int:id>/', views.edit_trip, name='edit_trip'),
path('trips/delete/<int:id>/', views.delete_trip, name='delete_trip'),

# Maintenance
path('maintenance/', views.maintenance_list, name='maintenance'),
path('maintenance/add/', views.add_maintenance, name='add_maintenance'),
path('maintenance/edit/<int:id>/', views.edit_maintenance, name='edit_maintenance'),
path('maintenance/delete/<int:id>/', views.delete_maintenance, name='delete_maintenance'),

# Fuel
path('fuel/', views.fuel_list, name='fuel'),
path('fuel/add/', views.add_fuel, name='add_fuel'),
path('fuel/edit/<int:id>/', views.edit_fuel, name='edit_fuel'),
path('fuel/delete/<int:id>/', views.delete_fuel, name='delete_fuel'),

# Expense
path('expenses/', views.expense_list, name='expenses'),
path('expenses/add/', views.add_expense, name='add_expense'),
path('expenses/edit/<int:id>/', views.edit_expense, name='edit_expense'),
path('expenses/delete/<int:id>/', views.delete_expense, name='delete_expense'),
path('reports/', views.reports, name='reports'),
]