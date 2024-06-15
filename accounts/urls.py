from django.urls import path
from .views import *
from. import views
from rest_framework_simplejwt.views import (TokenRefreshView,)



urlpatterns=[
    path('register/', RegisterUserView.as_view(), name='register'),
    path('verify-email/', VerifyUserEmail.as_view(), name='verify'),
    path('login/',LoginUserView.as_view(),name='login'),
    path('profile/', TestingAuthenticatedReq.as_view(), name='granted'),
    path('token/refresh/',TokenRefreshView.as_view(),name='refresh-token'),
    path('password-reset/', PasswordResetRequestView.as_view(), name='password-reset'),
    path('password-reset-confirm/<uidb64>/<token>/', PasswordResetConfirm.as_view(), name='password-reset-confirm'),
    path('set-new-password/', SetNewPasswordView.as_view(), name='set-new-password'),
    path('logout/', LogoutApiView.as_view(), name='logout'),


    path('asl_sign_detection', ASLDetectionView.as_view()),
    path('speech_text', SpeechTextView.as_view()),
    path('text_sign', TextSignView.as_view()),
    path('animate', AnimationView.as_view(), name='animate'),
    
    
]