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
    )
    else:
        filtered_data=Income.objects.filter(
            user=user,
        )
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
