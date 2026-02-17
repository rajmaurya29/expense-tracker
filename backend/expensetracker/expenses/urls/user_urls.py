from django.urls import path
from expenses.views import user_views

urlpatterns = [
    path('login/',user_views.MyTokenObtainPairView.as_view(),name="login_user"),
    path('register/',user_views.registerUser,name="register_user"),
    path('logout/',user_views.logoutUser,name='logout_user'),
    path('transactions/',user_views.recentTransactions,name='recent_transactions'),
    path('total/',user_views.total_detail,name='totalDetail'),
    path('recent-total/',user_views.recentTotal,name='recent-total'),
    path('transactions-total/',user_views.recentTransactionsTotal,name='recent-transactions-total'),
    path('transactions/csv/',user_views.export_csv,name='export-csv'),
    path('health/',user_views.health,name='health'),
    path('fetch/',user_views.fetchUser,name='fetchUser'),
    path('forgot-password/',user_views.forgot_password,name='forgot-password'),
    path('reset-password/',user_views.reset_password,name='reset-password'),
    path('verify-email/',user_views.verify_email,name='verify-email'),
]
