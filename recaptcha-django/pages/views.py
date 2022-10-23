from django.shortcuts import render
from pages.fetch_recaptcha_secret_key import fetch_recaptcha_secret_key
import requests


def index(request):
    context = {}

    if request.method == "POST":
        username = request.POST["username"]
        recaptcha_response = request.POST["g-recaptcha-response"]

        secret_key = fetch_recaptcha_secret_key()

        r = requests.post(
            "https://www.google.com/recaptcha/api/siteverify",
            data={"secret": secret_key, "response": recaptcha_response},
        )
        google_response = r.json()

        if google_response["success"]:
            context["message"] = (
                "reCAPTCHA challenge passed. "
                + 'User "{}" created successfully.'.format(username)
            )
        else:
            context["message"] = "reCAPTCHA challenge failed."

            if "error-codes" in google_response:
                error_codes = ", ".join(google_response["error-codes"])
                context["message"] += " Error codes: {}".format(error_codes)

    return render(request, "pages/index.html", context)
