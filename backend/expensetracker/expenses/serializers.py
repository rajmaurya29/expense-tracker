from expenses.models import *
from rest_framework import serializers


class UserSeriallizer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields='__all__'
    
class CategorySeriallizer(serializers.ModelSerializer):
    class Meta:
        model=Category
        fields='__all__'

class ExpenseSeriallizer(serializers.ModelSerializer):
    class Meta:
        model=Expense
        fields='__all__'


class IncomeSeriallizer(serializers.ModelSerializer):
    class Meta:
        model=Income
        fields='__all__'