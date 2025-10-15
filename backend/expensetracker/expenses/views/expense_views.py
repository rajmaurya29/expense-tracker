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
from django.http import HttpResponse
import csv 
from datetime import datetime
@api_view(['post'])
@permission_classes([IsAuthenticated])
def create_expense(request):
    # print(request.data["date"])
    data=request.data
    category,_=Category.objects.get_or_create(
        name=data['category']
    )
    date_str=datetime.strptime(data["date"], "%Y-%m-%d").date()
    # print(date_str)
    exp=Expense.objects.create(
        user=request.user,
        title=data['title'],
        amount=data['amount'],
        category=category,
        notes=data['notes'],
        date=date_str

        
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
    ).order_by("-date")
    else:
        # print(8)
        filtered_data=Expense.objects.filter(
            user=user,
        ).order_by("-date")
        # print(filtered_data)
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
        # print(expense_serializer.data)
        if(len(expense_serializer.data)>0):

            category_name.append(i["name"])
            total=0
            for i in expense_serializer.data:
                total=total+float(i["amount"])
            category_frequency.append(total)
        # value[i["name"]]=len(income_serializer.data)

    # serializer=CategorySerializer(category,many=True)
    # print(serializer)
    return Response({"category_name":category_name,"category_frequency":category_frequency})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def recentTransactionsExpense(request):
    expense=Expense.objects.filter(user=request.user).order_by("-date")[:5]
    serializer=ExpenseSerializer(expense,many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def export_csv(request):
    response=HttpResponse(content_type='text/csv')
    response['content-Disposition']='attachment; filename="transactions-expense.csv"'
    writer=csv.writer(response)
    writer.writerow(['title','amount','category','date','notes'])
   
    expense=Expense.objects.filter(user=request.user).order_by("-date")
    expense_data=[]
    for i in expense:
        expense_data.append({
            "title":i.title,
            "amount":-1*i.amount,
            "category":i.category,
            "date":i.date,
            "notes":i.notes
        })
    transactions=expense_data
    transactions.sort(key=lambda x:x["date"],reverse=True)
    for i in transactions:
        writer.writerow([i['title'],i['amount'],i['category'],i['date'],i['notes']])
    return response


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def editExpense(request):
    data=request.data
    # print(data)
    old_expense=Expense.objects.get(user=request.user,id=data['id'])
    # old_category=Category.objects.get(id=old_income.category)
    # serializer=ExpenseSerializer(old_expense,many=False)
    if old_expense.category!=data['categoryName']:
        category_obj,_=Category.objects.get_or_create(name=data['categoryName'])
        old_expense.category=category_obj
    
    old_expense.title=data['title']
    old_expense.amount=data['amount']
    old_expense.date=data['date']

    date_str=datetime.strptime(data["date"], "%Y-%m-%d").date()
    old_expense.notes=date_str
    old_expense.notes=data['notes']
    old_expense.save()

    new_expense=Expense.objects.get(user=request.user,id=data['id'])
    expense_serializer=ExpenseSerializer(new_expense,many=False)
  
    return Response({"status":"expense updated","expense":expense_serializer.data})