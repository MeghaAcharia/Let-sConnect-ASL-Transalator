from django.shortcuts import render
from rest_framework.generics import GenericAPIView
from rest_framework import generics
import io
import os
from .serializers import *
from rest_framework.response import Response
from rest_framework import status
from .utils import send_code_to_user

from .models import *
from rest_framework.permissions import IsAuthenticated,AllowAny
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import smart_str,DjangoUnicodeDecodeError
from django.contrib.auth.tokens import PasswordResetTokenGenerator

from .text_to_sign import *
from .speech_to_text import *
import sys
sys.path.append('C:\Desktop\backend\letsconnect_backend')
#from inference_classifier import sign_lang_recognition_asl
from realtimedetectiontest import recognize_sign
# Create your views here.


class RegisterUserView(GenericAPIView):
    serializer_class=UserRegisterSerializer
    def post(self,request):
        user_data=request.data
        serializer=self.serializer_class(data=user_data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            user=serializer.data
            send_code_to_user(user['email'])
            #send email function user['email']
            print(user)
            return Response({
                'data':user,
                'message':f'hi thanks for signing up a passcode has be sent to verify your email'
            },status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class VerifyUserEmail(GenericAPIView):
    def post(self,request):
        otpcode=request.data.get('otp')
        try:
            user_code_obj=OneTimePassword.objects.get(code=otpcode)
            user=user_code_obj.user
            if not user.is_verified:
                user.is_verified=True
                user.save()
                return Response({
                    'message': 'account verified successfully!'
                }, status=status.HTTP_200_OK)
            return Response({
                'message':'code is invalid user already verified'
            }, status=status.HTTP_204_NO_CONTENT)
        
        except OneTimePassword.DoesNotExist:
            return Response({'message':'passcode not provided'}, status=status.HTTP_404_NOT_FOUND)
        
class LoginUserView(GenericAPIView):
    serializer_class= LoginSerializer
    def post(self,request):
        serializer=self.serializer_class(data=request.data,context={'request':request})
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data,status=status.HTTP_200_OK)


class TestingAuthenticatedReq(GenericAPIView):
    permission_classes=[IsAuthenticated]

    def get(self, request):

        data={
            'msg':'its works'
        }
        return Response(data, status=status.HTTP_200_OK)
    
class PasswordResetRequestView(GenericAPIView):
    serializer_class=PasswordResetRequestserializer
    def post(self,request):
        serializer=self.serializer_class(data=request.data,context={'request':request})
        serializer.is_valid(raise_exception=True)
        return Response({'message':'we have sent you a link to reset your password'},status=status.HTTP_200_OK)
    

class PasswordResetConfirm(GenericAPIView):
    def get(self,request,uidb64,token):
        try:
            user_id=smart_str(urlsafe_base64_decode(uidb64))
            user=User.objects.get(id=user_id)
            if not PasswordResetTokenGenerator().check_token(user, token):
                return Response({'message':'token is invalid or has expired'}, status=status.HTTP_401_UNAUTHORIZED)
            return Response({'success':True, 'message':'credentials is valid', 'uidb64':uidb64, 'token':token}, status=status.HTTP_200_OK)

        except DjangoUnicodeDecodeError as identifier:
            return Response({'message':'token is invalid or has expired'}, status=status.HTTP_401_UNAUTHORIZED)

class SetNewPasswordView(GenericAPIView):
    serializer_class=SetNewPasswordSerializer
    def patch(self, request):
        serializer=self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response({'success':True, 'message':"password reset is succesful"}, status=status.HTTP_200_OK)

class LogoutApiView(GenericAPIView):
    serializer_class=LogoutUserSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        serializer=self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(status=status.HTTP_200_OK)


#communications
class SpeechTextView(GenericAPIView):
     def get(self, request):
        result = speech_to_text()
        return Response({'status': 200,'text': result})


class AnimationView(GenericAPIView):
    def post(self, request):

        final = []
        tags = request.data['tags']
        print(tags)

        for val in tags:
            sign = animations.objects.filter(tag=val).first()
            print("SIGN:",sign)
            

            if sign is not None:
                serializer = AnimationSerializer(sign)
                # print("SERIALISER::",serializer)
                # print("TAG IS:",serializer.data['tag'])
                video_file = serializer.data['video']
                print("Video file:",video_file)
                # video_url = HttpResponse(video_file, content_type='video/mp4')
                # video_url = video_file.url
                # video_url = request.build_absolute_uri(video_file.url)
                # print("video URL: ",video_url)

                # video_file = serializer.data['video']
                # video_url = request.build_absolute_uri(video_file.url)
                final.append(video_file)
                print('FINAL:',final)
      
        return Response({
            'status': 200,
            'message': 'success',
            'videos': final
        })

#nltk conversion
class TextSignView(GenericAPIView):
    def post(self,request):
        t = request.data['text']

        
        set = animations.objects.all()
        database = []
        for s in set:
            database.append(s.tag)
        
        print("database:",database)

        result = text_to_sign(t,database)
        return Response({'status': 200,'text': result})


class ASLDetectionView(GenericAPIView):
    def post(self, request, format=None):
        video_file = request.FILES.get('videoFile')
        print("*********",video_file)

        # Save the video file. Here, we assume you have a "videos" directory where you want to save the files
        video_path = f'videos/{video_file.name}'

        #clear all existing data
        print("xxxxxxx",os.path.exists(video_path))
        if os.path.exists(video_path):
            os.remove(video_path)

        with open(video_path, 'wb') as file:
            for chunk in video_file.chunks():
                file.write(chunk)

        # Convert the video to MP4
        # Method 1
        # mp4_path = f'videos/{os.path.splitext(video_file.name)[0]}.mp4'
        # convert_webm_to_mp4(video_path,mp4_path)
        # print("###############mp4 path",mp4_path)

        # Process the MP4 video file as needed
        # Perform your desired operations on the saved MP4 video file
        result = recognize_sign()
        print("RESULT:",result)

        # txt="" 

        # for i in range(len(result)):
        #     if result[i] == 'spcae':
        #         txt = txt + " "
        #     else:
        #         txt = txt + result[i]
        
        # print(txt)

        # Return a response
        return Response({
            'message': 'Video file received, converted to MP4, and processed successfully', 
            'txt': result
        })
