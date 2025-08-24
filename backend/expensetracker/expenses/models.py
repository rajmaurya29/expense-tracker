from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class Category(models.Model):
    name=models.CharField(max_length=20,null=False,blank=False)
    # type=models.CharField(max_length=20,choices=[("income","income"),("expense","expense")],default="expense")
    def __str__(self):
        return self.name
    
class Expense(models.Model):
    user=models.ForeignKey(User,on_delete=models.SET_NULL,null=True)
    title=models.CharField(max_length=100,null=False,blank=False)
    amount=models.DecimalField(max_digits=20,decimal_places=2)
    category=models.ForeignKey(Category,on_delete=models.CASCADE)
    date=models.DateField(auto_now_add=True)
    notes=models.TextField(max_length=40)
    def __str__(self):
        return self.title

class Income(models.Model):
    user=models.ForeignKey(User,on_delete=models.SET_NULL,null=True)
    source=models.CharField(max_length=100,null=False,blank=False)
    category=models.ForeignKey(Category,on_delete=models.CASCADE)
    amount=models.DecimalField(max_digits=20,decimal_places=2)
    date=models.DateField(auto_now_add=True)
    notes=models.TextField(max_length=40)
    def __str__(self):
        return self.source