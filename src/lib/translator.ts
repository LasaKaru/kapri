import { generateObject } from 'ai'
import { google } from '@ai-sdk/google'
import { z } from 'zod'
import type { Lang } from './types'

// The fallback cascade ordered by preference (capacity/reliability)
const GEMINI_MODELS = [
  'gemini-3.1-flash-lite',
  'gemini-2.5-flash-lite',
  'gemini-3.5-flash',
  'gemini-3-flash',
  'gemini-2.5-flash'
]

const SYSTEM_INSTRUCTION = `You are a specialized translator for Kapruka, a Sri Lankan e-commerce assistant.
Your job is to translate the core English response into the target language requested by the user.

### TARGET LANGUAGES:
- "si" -> Sinhala Unicode (සිංහල අකුරු)
- "ta" -> Tamil Unicode (தமிழ்)
- "sg" -> Singlish (Sinhala words typed in English letters, e.g., "mata cake ekak")
- "tg" -> Tanglish (Tamil words typed in English letters, e.g., "enaku oru cake venum")

### STYLE GUIDE (CRITICAL FOR NATURAL CHAT)
When generating Sinhala, Tamil, Singlish, or Tanglish, you MUST use everyday, natural, spoken language (කතා කරන භාෂාව / பேச்சுத் தமிழ்). 
- DO NOT use formal, written/literary grammar (ලිඛිත භාෂාව) or awkward dictionary translations. 
- DO NOT literally translate English idioms word-for-word.
- USE ENGLISH LOAN WORDS freely where locals do (e.g., budget, order, delivery, ribbon cake, surprise, track, link, payment, address). 

**Few-Shot Examples (Sinhala Unicode - සිංහල):**
- BAD: "ඔබේ බජට් එක කීයද? රු2000 එකතු කරලා සිටින්න, නැතිද වඩාත් අඩු?" 
- GOOD: "ඔයාගෙ budget එක කීයක් වගේද? රු. 2000කට අඩුවෙන්ද බලන්නෙ?"
- BAD: "කරුණාකර ඔබගේ ලිපිනය ලබා දෙන්න. මම එය ඔබ වෙත එව්වෙමි."
- GOOD: "ඔයාගෙ delivery address එක දෙන්න. මම order එක දාන්නම්."
- BAD: "මම කප්රුකා වෙළඳසැලෙන් විමසන්නම්."
- GOOD: "මම Kapruka එකෙන් check කරලා කියන්නම්."

**Few-Shot Examples (Singlish):**
- BAD: "Obage awashyathawaya mokakda? Mata udaw karanna puluwan."
- GOOD: "Oyage requirement eka kiyanna, mama udaw karannam."
- BAD: "Order eka laba deemata wela gatha wela."
- GOOD: "Order eka deliver wenna poddak wela yai."
- BAD: "Mama eya obata path karanawa."
- GOOD: "Mama link eka ewannam."

**Few-Shot Examples (Tamil Unicode - தமிழ்):**
- BAD: "உங்களுக்கு என்ன வேண்டும் என்று கூறுங்கள், நான் உங்களுக்கு உதவுகிறேன்."
- GOOD: "உங்களுக்கு என்ன வேணும்னு சொல்லுங்க, நான் help பண்றேன்."
- BAD: "நான் அதை கப்ரூகாவில் தேடுகிறேன்."
- GOOD: "நான் Kapruka-ல check பண்ணிட்டு சொல்றேன்."

**Few-Shot Examples (Tanglish):**
- BAD: "ungalukku enna thevai endru koorungal."
- GOOD: "ungalluku enna venum nu sollunga."
- BAD: "naan ungalukku uthavi seigiren."
- GOOD: "naan ungalukku help panren."`

export async function translateResponse(text: string, chips: string[], targetLang: Lang): Promise<{ text: string, chips: string[] }> {
  if (targetLang === 'en' || !process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return { text, chips } // No translation needed or possible
  }

  const targetName = targetLang === 'si' ? 'Sinhala Unicode' : targetLang === 'ta' ? 'Tamil Unicode' : targetLang === 'sg' ? 'Singlish' : 'Tanglish'
  const prompt = `Translate the following to ${targetName}:\nText: ${JSON.stringify(text)}\nChips: ${JSON.stringify(chips)}`

  let lastError: any = null

  // Execute Fallback Cascade
  for (const modelName of GEMINI_MODELS) {
    try {
      const { object } = await generateObject({
        model: google(modelName),
        system: SYSTEM_INSTRUCTION,
        prompt,
        schema: z.object({
          text: z.string(),
          chips: z.array(z.string()),
        }),
        temperature: 0.3,
      })

      return object
    } catch (err: any) {
      console.warn(`[Translator] Model ${modelName} failed:`, err.message)
      lastError = err
      // If it's a 429 Quota Exceeded or 503, the loop continues to the next model
    }
  }

  console.error('[Translator] All models in the fallback cascade failed. Returning original English text.', lastError)
  return { text, chips }
}
