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
from django.core.validators import validate_email
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from django.template.loader import render_to_string
from django.conf import settings

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


@api_view(['HEAD'])
def health(request):
    return Response({"status":"ok"})

@api_view(['GET'])
def fetchUser(request):
    try:
        user=request.user
        if not user.is_authenticated:
            return Response({"message":"Invalid User"},status=HTTP_401_UNAUTHORIZED)
        userSerializer=UserSerializer(user,many=False)
        return Response(userSerializer.data)
    except:
        return Response({"message":"Invalid User"},status=HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
def registerUser(request):
    data=request.data
  
    try:
        validate_email(data['email'])
        validate_password(data["password"])
        user=User.objects.create_user(
            first_name=data["name"],
            username=data["email"],
            email=data["email"],
            password=data["password"]
        )   
        # serializer=UserSerializer(user,many=False)
        # return Response(serializer.data)
        user.is_active=False
        user.save()
        email=data.get("email")

        user=User.objects.filter(email=email).first()

        if user:
            
            uid=urlsafe_base64_encode(force_bytes(user.pk))
            token=token_generator.make_token(user)
            # print("uid "+uid)
            email_url=(
                f"{settings.FRONTEND_URL}/verify-email?uid={uid}&token={token}"
            )
            # print("flag 3")
            html_content=render_to_string(
                "users/verify_email.html",
                {"email_url":email_url}
            )
            
            try:
                # print(settings.DEFAULT_FROM_EMAIL,"\n",settings.SENDGRID_API_KEY)
                message=Mail(
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    to_emails=user.email,
                    subject="Collab Notes verify email request",
                    html_content=html_content
                )
                sg = SendGridAPIClient(settings.SENDGRID_API_KEY)
                sg.send(message)
            except Exception as e:
                print("sendgrid error:",e)
        return Response({"message":"Verify email sent"},status=HTTP_200_OK)       
    except ValidationError as e:
        message={"message":e.messages}
        return Response(message,status=HTTP_400_BAD_REQUEST)
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
    fromDate=request.query_params.get("from")
    toDate=request.query_params.get("to")
    income=Income.objects.filter(user=request.user).order_by("-date")[:10]
    # print(fromDate)
    if fromDate and toDate:
        # print("working")
        income=income.filter(date__gte=fromDate,date__lte=toDate)
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
    if fromDate and toDate:
        expense=expense.filter(date__gte=fromDate,date__lte=toDate)
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
    fromDate=request.query_params.get("from")
    toDate=request.query_params.get("to")
    income=Income.objects.filter(user=request.user).order_by("-date")
    if fromDate and toDate:
        income=income.filter(date__gte=fromDate,date__lte=toDate)
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
    if fromDate and toDate:
        expense=expense.filter(date__gte=fromDate,date__lte=toDate)
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
    fromDate=request.query_params.get("from")
    toDate=request.query_params.get("to")
    income=Income.objects.filter(user=request.user)
    if fromDate and toDate:
        income=income.filter(date__gte=fromDate,date__lte=toDate)
    income_value=0
    for i in income:
        income_value+=i.amount
    expense=Expense.objects.filter(user=request.user)
    if fromDate and toDate:
        expense=expense.filter(date__gte=fromDate,date__lte=toDate)
    expense_value=0
    for i in expense:
        expense_value+=i.amount
    total_value=income_value-expense_value
    return Response({"total amount":total_value,"total income":income_value,"total expense":expense_value})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def recentTotal(request):
    fromDate=request.query_params.get("from")
    toDate=request.query_params.get("to")
    total=0
    income=Income.objects.filter(user=request.user).order_by("-date")
    if fromDate and toDate:
        income=income.filter(date__gte=fromDate,date__lte=toDate)
    income_data=[]
    for i in income:
        income_data.append({
            "amount":i.amount,
            "date":i.date,
        })
    expense=Expense.objects.filter(user=request.user).order_by("-date")
    if fromDate and toDate:
        expense=expense.filter(date__gte=fromDate,date__lte=toDate)
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
    return response

token_generator=PasswordResetTokenGenerator()
@api_view(['POST'])
def forgot_password(request):
    data=request.data
    email=data.get("email")

    if not email:
        return Response({"message":"If user exit, email sent"})
    
    user=User.objects.filter(email=email).first()

    if user:
        uid=urlsafe_base64_encode(force_bytes(user.pk))
        token=token_generator.make_token(user)
        # print("uid "+uid)
        reset_link=(
            f"{settings.FRONTEND_URL}/reset-password?uid={uid}&token={token}"
        )
        html_content=render_to_string(
            "users/reset_password_email.html",
            {"reset_link":reset_link}
        )
        
        try:
            message=Mail(
                from_email=settings.DEFAULT_FROM_EMAIL,
                to_emails=user.email,
                subject="Proshop password reset request",
                html_content=html_content
            )
            sg = SendGridAPIClient(settings.SENDGRID_API_KEY)
            sg.send(message)
        except Exception as e:
            print("sendgrid error:",e)
    return Response({"message":"If user exit, email sent"},status=HTTP_200_OK)


#verify email for register  
@api_view(['POST'])
def verify_email(request):
    data=request.data
    uid=data['uid']
    token=data['token']
    

    if not uid or not token :
        return Response({"message":"Invalid attempt"},status=HTTP_400_BAD_REQUEST)
    try:
        user_id=force_str(urlsafe_base64_decode(uid))
        user=User.objects.get(id=user_id)
    except :
        return Response(
            {"message": "Invalid verify link"},
            status=HTTP_400_BAD_REQUEST
        )

    if not token_generator.check_token(user,token):
        return Response({"message":" Token expired or invalid"},status=HTTP_400_BAD_REQUEST)
    
    user.is_active=True
    user.save()

    return Response({"message":"Email verified Successfully"},
                    status=HTTP_200_OK)


@api_view(['POST'])
def reset_password(request):
    data=request.data
    uid=data['uid']
    token=data['token']
    password=data['password']

    if not uid or not token or not password:
        return Response({"message":"Invalid attempt"},status=HTTP_400_BAD_REQUEST)
    try:
        user_id=force_str(urlsafe_base64_decode(uid))
        user=User.objects.get(id=user_id)
    except :
        return Response(
            {"message": "Invalid reset link"},
            status=HTTP_400_BAD_REQUEST
        )

    if not token_generator.check_token(user,token):
        return Response({"message":" Token expired or invalid"},status=HTTP_400_BAD_REQUEST)
    
    user.set_password(password)
    user.save()

    return Response({"message":"Password reset Successfully"},
                    status=HTTP_200_OK)
