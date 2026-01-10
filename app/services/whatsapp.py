import os
import requests

WHATSAPP_PHONE_NUMBER_ID = os.getenv("WHATSAPP_PHONE_NUMBER_ID")
WHATSAPP_ACCESS_TOKEN = os.getenv("WHATSAPP_ACCESS_TOKEN")
APP_ENV = os.getenv("APP_ENV", "development")

def send_whatsapp_message(to_number: str, message: str):
    """
    Sends a WhatsApp message using Meta Cloud API.
    Falls back to simulation logging if credentials missing or in dev mode.
    """
    if not WHATSAPP_PHONE_NUMBER_ID or not WHATSAPP_ACCESS_TOKEN:
        print(f"[SIMULATION] WhatsApp Message to {to_number}: {message}")
        return {"status": "simulated", "to": to_number, "message": message}

    url = f"https://graph.facebook.com/v17.0/{WHATSAPP_PHONE_NUMBER_ID}/messages"
    headers = {
        "Authorization": f"Bearer {WHATSAPP_ACCESS_TOKEN}",
        "Content-Type": "application/json"
    }
    data = {
        "messaging_product": "whatsapp",
        "to": to_number,
        "type": "text",
        "text": {"body": message}
    }
    
    try:
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"Error sending WhatsApp: {e}")
        # Fallback
        print(f"[SIMULATION FAILED ALERT] WhatsApp Message to {to_number}: {message}")
        return {"status": "error", "error": str(e)}

def send_emergency_alert(user_name: str, contacts: list, location: str = "Unknown"):
    """
    Iterates through contacts and sends alerts.
    """
    for contact in contacts:
        # Assuming contact is a dict {name, phone, relation}
        phone = contact.get('phone')
        if phone:
            msg = f"SOS ALERT! {user_name} needs help. Location: {location}. Please check the ElderGuard App immediately."
            send_whatsapp_message(phone, msg)
