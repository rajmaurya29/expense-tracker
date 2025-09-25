from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.contrib.auth.models import User
from rest_framework.decorators import permission_classes
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated,IsAdminUser
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from expenses.serializers import *
from rest_framework.status import *
from expenses.models import *
from django.http import HttpResponse
import csv 

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data=super().validate(attrs)
        serializer=UserSerializer(self.user).data
        for k,v in serializer.items():
            data[k]=v
        return data



class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class=MyTokenObtainPairSerializer
    def post(self,request,*args,**kwargs):
        response=super().post(request,*args,**kwargs)
        access_token=response.data.get('access')
        refresh_token=response.data.get('refresh')
        response.set_cookie(
            key='access_token',
            value=access_token,
            httponly=True,
            secure=True,
            samesite='None',
            path='/'
        )
        response.set_cookie(
            key='refresh_token',
            value=refresh_token,
            httponly=True,
            secure=True,
            samesite='None',
            path='/'
        )
        return response

@api_view(['POST'])
def registerUser(request):
    data=request.data
    print(data)
    try:
        user=User.objects.create_user(
            first_name=data["name"],
            username=data["email"],
            email=data["email"],
            password=data["password"]
        )   
        serializer=UserSerializer(user,many=False)
        return Response(serializer.data)
    except:
        message={"message":"Invalid user or user already exist"}
        return Response(message,status=HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def logoutUser(request):
    response=Response({"message":"logout successfully"},status=HTTP_200_OK)
    response.set_cookie(
            key='access_token',
            value='',
            max_age=0,
            expires='Thu, 01 Jan 1970 00:00:00 GMT',
            httponly=True,
            secure=True,
            samesite='None',
            path='/'
        )
    response.set_cookie(
            key='refresh_token',
            value='',
            max_age=0,
            expires='Thu, 01 Jan 1970 00:00:00 GMT',
            httponly=True,
            secure=True,
            samesite='None',
            path='/'
        )
    return response


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def recentTransactions(request):
    income=Income.objects.filter(user=request.user).order_by("-date")[:10]
    income_data=[]
    for i in income:
        income_data.append({
            "title":i.source,
            "amount":i.amount,
            "category":i.category,
            "date":i.date,
            "notes":i.notes
        })
    expense=Expense.objects.filter(user=request.user).order_by("-date")[:10]
    expense_data=[]
    for i in expense:
        expense_data.append({
            "title":i.title,
            "amount":-1*i.amount,
            "category":i.category,
            "date":i.date,
            "notes":i.notes
        })
    transactions=income_data+expense_data
    transactions.sort(key=lambda x:x["date"],reverse=True)
    transactionsSerializer=RecentTransactionsSerializer(transactions[:10],many=True)
    return Response(transactionsSerializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def recentTransactionsTotal(request):
    income=Income.objects.filter(user=request.user).order_by("-date")
    income_data=[]
    for i in income:
        income_data.append({
            "title":i.source,
            "amount":i.amount,
            "category":i.category,
            "date":i.date,
            "notes":i.notes
        })
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
    transactions=income_data+expense_data
    transactions.sort(key=lambda x:x["date"],reverse=True)
    transactionsSerializer=RecentTransactionsSerializer(transactions,many=True)
    return Response(transactionsSerializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def total_detail(request):
    income=Income.objects.filter(user=request.user)
    income_value=0
    for i in income:
        income_value+=i.amount
    expense=Expense.objects.filter(user=request.user)
    expense_value=0
    for i in expense:
        expense_value+=i.amount
    total_value=income_value-expense_value
    return Response({"total amount":total_value,"total income":income_value,"total expense":expense_value})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def recentTotal(request):
    total=0
    income=Income.objects.filter(user=request.user).order_by("-date")
    income_data=[]
    for i in income:
        income_data.append({
            "amount":i.amount,
            "date":i.date,
        })
    expense=Expense.objects.filter(user=request.user).order_by("-date")
    expense_data=[]
    for i in expense:
        expense_data.append({
            "amount":-1*i.amount,
            "date":i.date,
        })
    transactions=income_data+expense_data
    transactions.sort(key=lambda x:x["date"])
    final=[]
    for i in transactions:
        # print(float(i["amount"]))
        total+=float(i["amount"])
        final.append({
            "amount":i["amount"],
            "date":i["date"],
            "total":total
        })
    # final.reverse()
    serializers=RecentTotalSerializer(final[-10:],many=True)
    return Response(serializers.data)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def export_csv(request):
    response=HttpResponse(content_type='text/csv')
    response['content-Disposition']='attachment; filename="transactions.csv"'
    writer=csv.writer(response)
    writer.writerow(['title','amount','category','date','notes'])
    income=Income.objects.filter(user=request.user).order_by("-date")
    income_data=[]
    for i in income:
        income_data.append({
            "title":i.source,
            "amount":i.amount,
            "category":i.category,
            "date":i.date,
            "notes":i.notes
        })
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
    transactions=income_data+expense_data
    transactions.sort(key=lambda x:x["date"],reverse=True)
    for i in transactions:
        writer.writerow([i['title'],i['amount'],i['category'],i['date'],i['notes']])
    return Response