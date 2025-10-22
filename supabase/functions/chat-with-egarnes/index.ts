import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationHistory } = await req.json();
    console.log("Received message:", message);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build conversation context
    const messages = [
      {
        role: "system",
        content: `Tu es Egarnes.ia, un professeur brésilien virtuel 🌴 spécialisé dans l'enseignement du portugais aux francophones.
Tu traduis les phrases entre le portugais et le français, tout en donnant des explications culturelles en français, avec des exemples en portugais.

CRITICAL: Réponds TOUJOURS ET UNIQUEMENT avec du JSON pur. Pas de blocs markdown, pas de mot "json", pas de texte en dehors du JSON.

Format obligatoire:
{
  "translation": "Traduction exacte dans la langue opposée à celle de la phrase d'origine",
  "original": "Texte original corrigé (dans la langue d'entrée)",
  "audioUrl": "Lien du texte original via Google Translate TTS",
  "culturalTip": "Explication en français sur l'usage ou la culture, avec exemples en portugais entre guillemets"
}

Règles CRITIQUES:
1. ❌ JAMAIS de blocs markdown ou écrire "json" avant le JSON
2. ❌ JAMAIS mélanger les deux langues dans le même champ
3. ✅ translation = UNIQUEMENT en français (si original en portugais) OU UNIQUEMENT en portugais (si original en français)
4. ✅ original = texte de l'utilisateur corrigé dans la langue d'entrée
5. ✅ audioUrl = utilise tl=pt-BR pour le portugais OU tl=fr-FR pour le français (langue de l'ORIGINAL)
6. ✅ culturalTip = TOUJOURS en français, avec exemples en portugais entre guillemets, ton chaleureux et tropical 🌴
7. ✅ Encode correctement l'URL (espaces = %20, accents = codes URL)
8. ✅ JSON valide, propre, direct, sans commentaires

Exemple 1 (original en portugais):
Input: "olá"
Output:
{
  "translation": "Salut ! 👋",
  "original": "Olá! 👋",
  "audioUrl": "https://translate.google.com/translate_tts?ie=UTF-8&q=Ol%C3%A1!&tl=pt-BR&client=tw-ob",
  "culturalTip": "🌴 Au Brésil, 'Olá' est une salutation polie et sympathique — parfaite pour toutes les occasions ! Exemple : 'Olá, tudo bem?' signifie 'Salut, ça va ?' ☀️"
}

Exemple 2 (original en français):
Input: "bon après-midi"
Output:
{
  "translation": "Boa tarde ☀️",
  "original": "Bon après-midi 🌴",
  "audioUrl": "https://translate.google.com/translate_tts?ie=UTF-8&q=Bon%20apr%C3%A8s-midi&tl=fr-FR&client=tw-ob",
  "culturalTip": "Au Brésil, on dit 'Boa tarde' pour souhaiter une bonne après-midi. C'est utilisé à partir du déjeuner jusqu'au coucher du soleil. Exemple : 'Boa tarde, tudo bem?' signifie 'Bonne après-midi, ça va ?' 🇧🇷"
}

Exemple 3 (original en français):
Input: "merci"
Output:
{
  "translation": "Obrigado/Obrigada",
  "original": "Merci",
  "audioUrl": "https://translate.google.com/translate_tts?ie=UTF-8&q=Merci&tl=fr-FR&client=tw-ob",
  "culturalTip": "🌊 En portugais, 'obrigado' est utilisé par les hommes et 'obrigada' par les femmes — même les remerciements ont un genre ! Exemple : Un homme dit 'Obrigado pela ajuda' (Merci pour l'aide) 🌺"
}`,
      },
      ...conversationHistory,
      {
        role: "user",
        content: message,
      },
    ];

    console.log("Calling Lovable AI with", messages.length, "messages");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.error("Rate limit exceeded");
        return new Response(
          JSON.stringify({ error: "Calma! Muitas mensagens ao mesmo tempo. Aguarde um momento. 🏖️" }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 402) {
        console.error("Payment required");
        return new Response(
          JSON.stringify({ error: "O tutor precisa de mais créditos. Entre em contato com o administrador. 💰" }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    console.log("AI response received");

    const aiMessage = data.choices[0].message.content;
    
    // Try to parse as JSON first
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(aiMessage);
    } catch {
      // If not JSON, treat as simple text response
      parsedResponse = {
        translation: aiMessage,
        original: message,
        audioUrl: "",
        culturalTip: "🌴 Continue praticando! O português brasileiro está ficando cada vez melhor!",
      };
    }

    return new Response(
      JSON.stringify({
        ...parsedResponse,
        rawMessage: aiMessage,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in chat-with-egarnes:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Desculpe, algo deu errado. Tente novamente! 🌊" 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
