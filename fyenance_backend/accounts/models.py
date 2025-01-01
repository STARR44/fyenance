from django.db import models
from django.utils import timezone
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.conf import settings
from django.urls import reverse

class FyenanceUser(AbstractUser):
    username = models.CharField(max_length = 50, blank = False, null = False, unique = True)
    display_name = models.CharField(max_length = 100, blank = True, null = True)
    email = models.EmailField(max_length=254, unique = True)
    first_name = models.CharField(max_length = 50, blank = True)
    last_name = models.CharField(max_length = 50, blank = True)
    phone_no = models.CharField(max_length = 10, blank = True)
    account_id = models.CharField(max_length = 50, blank = True)
    account_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    is_google_user = models.BooleanField(default=False)
    google_id = models.CharField(max_length=255, blank=True)
    REQUIRED_FIELDS = ['email']

    groups = models.ManyToManyField(
        Group,
        related_name="fyenanceuser_set",  # Custom related name
        blank=True,
        help_text="The groups this user belongs to.",
        verbose_name="groups",
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name="fyenanceuser_set",  # Custom related name
        blank=True,
        help_text="Specific permissions for this user.",
        verbose_name="user permissions",
    )

    def __str__(self):
      return "{}".format(self.username)