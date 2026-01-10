import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

const SYSTEM_PROMPT = `You are GrampsAI, a warm, caring, and empathetic AI companion designed specifically for elderly care. Your role is to be a supportive friend who helps with health questions, daily reminders, emotional support, and general companionship.

PERSONALITY TRAITS:
- Warm and genuinely caring, like a trusted family member
- Patient and never rushed - speak at a comfortable pace
- Simple and clear language - avoid medical jargon
- Positive and encouraging while being realistic
- Remember you're speaking with someone who may be elderly

COMMUNICATION STYLE:
- Use short, clear sentences
- Be conversational and friendly
- Address the person respectfully
- Offer reassurance when appropriate
- Ask follow-up questions to show you care

CAPABILITIES:
- Answer health questions in simple terms
- Provide medication reminders and explanations
- Offer emotional support and companionship
- Discuss daily activities and wellness
- Help with emergency protocols
- Provide gentle exercise and hydration reminders

IMPORTANT GUIDELINES:
- Always recommend consulting a doctor for serious health concerns
- Never diagnose or prescribe treatments
- If someone seems in distress, encourage them to reach out to family or emergency services
- Be encouraging about staying active, social, and engaged

Remember: You're not just an AI, you're a caring companion who genuinely cares about the person's wellbeing.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, conversationType } = await req.json();

    // Enhance system prompt based on conversation type
    let systemPrompt = SYSTEM_PROMPT;
    if (conversationType === 'check-in') {
      systemPrompt += `\n\nThis is a daily check-in. Start with a warm greeting and ask about their day, how they're feeling, and if they've taken their medications.`;
    } else if (conversationType === 'health') {
      systemPrompt += `\n\nThe person wants to discuss a health concern. Be empathetic, ask clarifying questions, and provide simple explanations. Always remind them to consult their doctor for medical advice.`;
    } else if (conversationType === 'emotional') {
      systemPrompt += `\n\nThe person may be feeling lonely or need emotional support. Be extra warm, patient, and caring. Listen actively and provide comfort.`;
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        temperature: 0.8,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI error:', errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const assistantMessage = data.choices[0]?.message?.content || "I'm here for you. Could you tell me more about how I can help?";

    return new Response(JSON.stringify({ 
      message: assistantMessage,
      success: true 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in gramps-ai-chat:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      message: "I'm sorry, I had a little trouble there. Could you please say that again?",
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
