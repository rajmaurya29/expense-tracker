from django.urls import path
from expenses.views import user_views

urlpatterns = [
    path('login/',user_views.MyTokenObtainPairView.as_view(),name="login_user"),
    path('register/',user_views.registerUser,name="register_user"),
    path('logout/',user_views.logoutUser,name='logout_user'),
    path('transactions/',user_views.recentTransactions,name='recent_transactions'),
    path('total/',user_views.total_detail,name='totalDetail'),
]
