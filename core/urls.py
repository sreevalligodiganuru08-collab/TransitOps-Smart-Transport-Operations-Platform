from django.urls import path
from . import views

urlpatterns = [
    path('', views.login_page, name='login'),

    path('dashboard/', views.dashboard, name='dashboard'),

    path('vehicles/', views.vehicle_list, name='vehicles'),
    path('vehicles/add/', views.add_vehicle, name='add_vehicle'),
    path('vehicles/edit/<int:id>/', views.edit_vehicle, name='edit_vehicle'),
    path('vehicles/delete/<int:id>/', views.delete_vehicle, name='delete_vehicle'),

    path('drivers/', views.driver_list, name='drivers'),
    path('drivers/add/', views.add_driver, name='add_driver'),
    path('drivers/edit/<int:id>/', views.edit_driver, name='edit_driver'),
    path('drivers/delete/<int:id>/', views.delete_driver, name='delete_driver'),

    path('trips/', views.trip_list, name='trips'),
    path('maintenance/', views.maintenance_list, name='maintenance'),
    path('expenses/', views.expense_list, name='expenses'),
    path('reports/', views.reports, name='reports'),
]