from django.urls import path
from expenses.views import income_views

urlpatterns = [
    path('create/',income_views.create_income,name="create_income"),
    path('get/',income_views.get_incomes,name='get_incomes'),
    path('get/<int:id>',income_views.get_income,name='get_income'),
    path('delete/<int:id>',income_views.delete_income,name='delete_income'),
    path('categoryIncome/',income_views.income_category,name='income_category'),
    path('transactions/',income_views.recentTransactionsIncome,name='recentTransactions'),
    
]
