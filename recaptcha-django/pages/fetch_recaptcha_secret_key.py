import os
from zero_sdk import zero

secret_key = None


def fetch_recaptcha_secret_key():
    global secret_key

    if secret_key is not None:
        return secret_key

    ZERO_TOKEN = os.getenv("ZERO_TOKEN")

    if ZERO_TOKEN is None:
        raise Exception("ZERO_TOKEN environment variable not set.")

    secrets = zero(token=ZERO_TOKEN, pick=["recaptcha"]).fetch()

    if "recaptcha" not in secrets:
        raise Exception("recaptcha secret not found.")

    if "secret_key" not in secrets["recaptcha"]:
        raise Exception("secret_key field not found.")

    secret_key = secrets["recaptcha"]["secret_key"]

    if len(secret_key) == 0:
        raise Exception("secret_key field is empty.")

    return secret_key
