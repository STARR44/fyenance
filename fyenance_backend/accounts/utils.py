from google.oauth2 import id_token
from google.auth.transport import requests
import os

def verify_google_token(token):
    try:
        # Specify the CLIENT_ID from the Google Cloud console
        CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')
        idinfo = id_token.verify_oauth2_token(token, requests.Request(), CLIENT_ID)

        # ID token is valid, extract user details
        google_id = idinfo.get('sub')
        email = idinfo.get('email')
        name = idinfo.get('name')
        return {'google_id': google_id, 'email': email, 'name': name}
    except ValueError:
        # Invalid token
        return None
