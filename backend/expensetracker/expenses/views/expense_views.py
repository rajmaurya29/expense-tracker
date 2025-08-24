from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.contrib.auth.models import User
from rest_framework.decorators import permission_classes
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated,IsAdminUser
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from expenses.serializers import UserSerializer,IncomeSerializer,ExpenseSerializer,CategorySerializer
from rest_framework.status import *
from expenses.models import *


@api_view(['post'])
@permission_classes([IsAuthenticated])
def create_expense(request):
    data=request.data
    category,_=Category.objects.get_or_create(
        name=data['category']
    )
    exp=Expense.objects.create(
        user=request.user,
        title=data['title'],
        amount=data['amount'],
        category=category,
        notes=data['notes']
        
    )
    serializer=ExpenseSerializer(exp,many=False)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_expense(request,id):
    user=request.user
    try:
        data=Expense.objects.get(id=id)
    except:
        return Response({"detail":"failed to fetch expense"},status=HTTP_400_BAD_REQUEST)
    serializer=ExpenseSerializer(data,many=False)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_expenses(request):
    category=request.query_params.get("category")
    user=request.user
    # print(user)
    if category:
        # print(1)
        filtered_data=Expense.objects.filter(
        user=user,
        category__name=category,
    )
    else:
        # print(8)
        filtered_data=Expense.objects.filter(
            user=user,
        )
        print(filtered_data)
    serializer=ExpenseSerializer(filtered_data,many=True)
    return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_expense(request,id):
    user=request.user
    try:
        data_delete=Expense.objects.get(
            user=user,
            id=id
            )
        
        Expense.delete(data_delete)
        return Response({"detail":"expense deleted successfully"})
    except:
        return Response({"detail":"failed to delete data"})
