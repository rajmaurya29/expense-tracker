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
def create_income(request):
    data=request.data
    category,_=Category.objects.get_or_create(
        name=data['category']
    )
    income=Income.objects.create(
        user=request.user,
        source=data['source'],
        category=category,
        amount=data['amount'],
        notes=data['notes']
        
    )
    serializer=IncomeSerializer(income,many=False)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_incomes(request):
    category=request.query_params.get("category")
    user=request.user
    if category:
        filtered_data=Income.objects.filter(
        user=user,
        category__name=category,
    ).order_by("-date")
    else:
        filtered_data=Income.objects.filter(
            user=user,
        ).order_by("-date")
    serializer=IncomeSerializer(filtered_data,many=True)
    return Response(serializer.data)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_income(request,id):
    # print(id)
    try:
        data=Income.objects.get(id=id)
    except:
        return Response({"detail":"failed to fetch income"},status=HTTP_400_BAD_REQUEST)
    serializer=IncomeSerializer(data,many=False)
    return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_income(request,id):
    user=request.user
    try:
        data_delete=Income.objects.get(
            user=user,
            id=id
            )
        
        Income.delete(data_delete)
        return Response({"detail":"income deleted successfully"})
    except:
        return Response({"detail":"failed to delete data"})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def income_category(request):
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

        income=Income.objects.filter(
            user=request.user,
            category_id=i["id"])
        income_serializer=IncomeSerializer(income,many=True)
        if(len(income_serializer.data)>0):
            category_name.append(i["name"])
            category_frequency.append(len(income_serializer.data))
        # value[i["name"]]=len(income_serializer.data)

    # serializer=CategorySerializer(category,many=True)
    # print(serializer)
    return Response({"category_name":category_name,"category_frequency":category_frequency})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def recentTransactionsIncome(request):
    income=Income.objects.filter(user=request.user).order_by("-date")[:5]
    serializer=IncomeSerializer(income,many=True)
    return Response(serializer.data)