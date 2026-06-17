/**
 * Shared language detection — works in browser + Node.
 *
 * Detects Sinhala (Unicode), Tanglish (romanised Sinhala mixed with English),
 * and English. Only these three languages are supported.
 */
import type { Lang } from './types'

// Common Sinhala words written in Latin script (Tanglish / Singlish)
const TANGLISH_HINTS = [
  // common words
  'mata','ekak','ekata','gannako','ganna','hadanna','oya','mama','tikak',
  'hoyanna','hoya','neda','denna','puluwan','kawda','monawada','genna',
  'kiyanna','heta','ada','salli','karanna','innawa','yanawa','enna','balanna',
  // family
  'amma','ammata','amage','thaththa','thatta','appa','nangi','akka','malli','aiya',
  // shopping
  'ganne','baduwak','thagi','thagga','gaana','gaanata','hodama','lassana',
  'sappu','order','gannada','aran','arinna','gamu',
  // emotions
  'suba','bohoma','ane','hari','sthuthi','supiri','niyamai','hari hari',
  // greetings
  'ayubowan','kohomada','kohomada hodin innawada',
  // occasions
  'avurudu','wesak','poson','uppanna','upandina','mal',
  // delivery
  'yawanna','yawanawa','gehen','gedara','gedarata',
  // common verbs / phrases
  'karanna','karannam','kiyannam','pennannak','pennanna','balaganna',
  'awashyai','oona','ona','puluwanda','thibunada','gannada',
  'aththai','methanin','ethanin','mokakda','kawada','koheда',
  // short affirmations that signal Tanglish context
  'ow','hari','naha','nehe','epa','ewa','meka','eka','okkoma',
]

const SI_RE = /[඀-෿]/

/**
 * Detect the language of a text string.
 *
 * Priority:
 *  1. Any Sinhala Unicode character → 'si'
 *  2. ≥1 Tanglish keyword hit → 'tl'
 *  3. Otherwise → 'en'
 */
export function detectLang(text: string): Lang {
  if (SI_RE.test(text)) return 'si'
  const t = ' ' + text.toLowerCase() + ' '
  let hits = 0
  for (const w of TANGLISH_HINTS) {
    if (t.includes(' ' + w + ' ') || t.includes(' ' + w + '.') || t.includes(' ' + w + '?') || t.includes(' ' + w + '!')) hits++
    else if (t.includes(w)) hits += 0.5
  }
  return hits >= 1 ? 'tl' : 'en'
}

/**
 * Compute effective language for a response.
 *
 * If the user actively typed in Sinhala or Tanglish, honour that.
 * Otherwise fall back to the user's preferred (toggle) language.
 */
export function computeEffectiveLang(
  detectedLang: Lang | undefined,
  preferredLang: Lang | undefined
): Lang {
  // Non-English detection = user explicitly chose a language by typing
  if (detectedLang === 'si' || detectedLang === 'tl') return detectedLang
  // Otherwise honour the header toggle preference
  if (preferredLang === 'si') return 'si'
  return preferredLang ?? 'en'
}
