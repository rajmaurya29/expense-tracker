from django.urls import path
from expenses.views import expense_views

urlpatterns = [
    path('create/',expense_views.create_expense,name="create_expense"),
    path('get/',expense_views.get_expenses,name='get_expenses'),
    path('get/<int:id>',expense_views.get_expense,name='get_expense'),
    path('delete/<int:id>',expense_views.delete_expense,name='delete_expense'),
]   
