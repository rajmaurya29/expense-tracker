from django.urls import path
from expenses.views import income_views

urlpatterns = [
    path('',income_views.income,name="create_get_edit_income"),
    path('categoryIncome/',income_views.income_category,name='income_category'),
    path('transactions/',income_views.recentTransactionsIncome,name='recentTransactions'),
    path('transactions/csv/',income_views.export_csv,name='export-csv'),
    path('<int:id>',income_views.individual_income,name='get_delete_income'),

]
