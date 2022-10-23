from django.apps import AppConfig
import os
from zero_sdk import zero


class PagesConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "pages"
