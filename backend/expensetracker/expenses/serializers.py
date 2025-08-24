from expenses.models import *
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    name=serializers.SerializerMethodField(read_only=True)
    class Meta:
        model=User
        fields=['id','username','email','name']
    def get_name(self,obj):
        name=obj.first_name
        return name
    
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model=Category
        fields='__all__'

class ExpenseSerializer(serializers.ModelSerializer):
    categoryName=serializers.SerializerMethodField(read_only=True)
    class Meta:
        model=Expense
        fields=['id','user','title','amount','categoryName','date','notes']
    def get_categoryName(self,obj):
        return obj.category.name


class IncomeSerializer(serializers.ModelSerializer):
    categoryName=serializers.SerializerMethodField(read_only=True)
    class Meta:
        model=Income
        fields=['id','user','source','amount','categoryName','date','notes']
    def get_categoryName(self,obj):
        return obj.category.name