from django.db import models
from django.core.validators import FileExtensionValidator
from django.contrib.auth.models import AbstractBaseUser,PermissionsMixin
from django.utils.translation import gettext_lazy as _
from .manager import UserManager
from rest_framework_simplejwt.tokens import RefreshToken
# Create your models here.

AUTH_PROVIDERS ={'email':'email', 'google':'google', 'github':'github', 'linkedin':'linkedin'}

class User(AbstractBaseUser,PermissionsMixin):
    email= models.EmailField(max_length=255, unique=True,verbose_name=_("Email Address"))
    first_name=models.CharField(max_length=100,verbose_name=_("First name"))
    last_name=models.CharField(max_length=100,verbose_name=_("Lirst name"))
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_verified=models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(auto_now=True)
    auth_provider=models.CharField(max_length=50, blank=False, null=False, default=AUTH_PROVIDERS.get('email'))
    
    USERNAME_FIELD="email"

    REQUIRED_FIELDS=["first_name","last_name"]

    objects= UserManager()


    def __str__(self) -> str:
        return self.email
    
    def tokens(self):
        refresh=RefreshToken.for_user(self)
        return{
            "refresh":str(refresh),
            "access":str(refresh.access_token)
        }
    
    @property
    def get_full_name(self):
        return f"{self.first_name} {self.last_name}"
    

class OneTimePassword(models.Model):
    user=models.OneToOneField(User,on_delete=models.CASCADE)
    code=models.CharField(max_length=6,unique=True)

    def __str__(self):
        return f"{self.user.first_name}-passcode"
        
class animations(models.Model):  
    tag = models.CharField(max_length=200)
    # "abc" "isl"
    # ensure "abc" "isl"
    # tagtype = "abc__isl" unique=True
    # tag = tagtype.split('__')[0]
    video = models.FileField(upload_to='animations',null=True, validators=[FileExtensionValidator(allowed_extensions=['MOV','avi','mp4','webm','mkv'])])

    def get_video_url(self):
        return self.video.url
    
class favs(models.Model):  
    username = models.ForeignKey(User, to_field="email", db_column="email", on_delete=models.CASCADE, null=True)
    word_phrase = models.TextField(max_length=200)
   