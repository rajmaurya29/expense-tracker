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

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def expense_category(request):
    category=Category.objects.all()
    serializer1=CategorySerializer(category,many=True)

    # ret=Income.objects.filter(
        
    # )
    # value={}
    serializer_data=serializer1.data
    # print(serializer_data)
    category_name=[]
    category_frequency=[]
    for i in serializer_data:
        # print(i["name"])

        expense=Expense.objects.filter(
            user=request.user,
            category_id=i["id"])
        expense_serializer=ExpenseSerializer(expense,many=True)
        if(len(expense_serializer.data)>0):
            category_name.append(i["name"])
            category_frequency.append(len(expense_serializer.data))
        # value[i["name"]]=len(income_serializer.data)

    # serializer=CategorySerializer(category,many=True)
    # print(serializer)
    return Response({"category_name":category_name,"category_frequency":category_frequency})