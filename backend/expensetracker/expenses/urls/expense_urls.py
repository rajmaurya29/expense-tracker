from django.urls import path
from expenses.views import expense_views

urlpatterns = [
    path('',expense_views.expense,name="create_get_edit_expense"),
    path('<int:id>',expense_views.individual_expense,name='get_delete_expense'),
    path('expenseCategory/',expense_views.expense_category,name='expense_category'),
    path('transactions/',expense_views.recentTransactionsExpense,name='recent_Transactions'),
    path('transactions/csv/',expense_views.export_csv,name='export-csv'),
]   
