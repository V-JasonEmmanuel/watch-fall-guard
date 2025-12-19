import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AlertRequest {
  elderlyName: string;
  cameraLocation: string;
  alertType: 'fall' | 'danger' | 'warning';
  recipientPhone: string;
  timestamp?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const fromWhatsApp = Deno.env.get('TWILIO_WHATSAPP_FROM');

    if (!accountSid || !authToken || !fromWhatsApp) {
      console.error('Missing Twilio credentials');
      throw new Error('Twilio credentials not configured');
    }

    const { elderlyName, cameraLocation, alertType, recipientPhone, timestamp }: AlertRequest = await req.json();

    if (!elderlyName || !cameraLocation || !alertType || !recipientPhone) {
      throw new Error('Missing required fields: elderlyName, cameraLocation, alertType, recipientPhone');
    }

    const alertTime = timestamp || new Date().toLocaleString();
    
    let messageBody = '';
    switch (alertType) {
      case 'fall':
        messageBody = `🚨 URGENT FALL ALERT 🚨\n\n` +
          `${elderlyName} has fallen!\n\n` +
          `📍 Location: ${cameraLocation}\n` +
          `⏰ Time: ${alertTime}\n\n` +
          `Please check on them immediately or contact emergency services if needed.`;
        break;
      case 'danger':
        messageBody = `⚠️ DANGER ALERT ⚠️\n\n` +
          `Concerning activity detected for ${elderlyName}\n\n` +
          `📍 Location: ${cameraLocation}\n` +
          `⏰ Time: ${alertTime}\n\n` +
          `Please verify their safety.`;
        break;
      case 'warning':
        messageBody = `⚡ ACTIVITY WARNING\n\n` +
          `Unusual activity detected for ${elderlyName}\n\n` +
          `📍 Location: ${cameraLocation}\n` +
          `⏰ Time: ${alertTime}`;
        break;
    }

    // Format phone number for WhatsApp
    const toWhatsApp = `whatsapp:${recipientPhone.startsWith('+') ? recipientPhone : '+' + recipientPhone}`;
    const fromNumber = `whatsapp:${fromWhatsApp.startsWith('+') ? fromWhatsApp : '+' + fromWhatsApp}`;

    console.log(`Sending WhatsApp alert to ${toWhatsApp} from ${fromNumber}`);

    // Send WhatsApp message via Twilio API
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    
    const formData = new URLSearchParams();
    formData.append('To', toWhatsApp);
    formData.append('From', fromNumber);
    formData.append('Body', messageBody);

    const response = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(`${accountSid}:${authToken}`),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Twilio API error:', result);
      throw new Error(result.message || 'Failed to send WhatsApp message');
    }

    console.log('WhatsApp message sent successfully:', result.sid);

    return new Response(
      JSON.stringify({ 
        success: true, 
        messageSid: result.sid,
        status: result.status 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error in send-whatsapp-alert function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
