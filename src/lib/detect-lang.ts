/**
 * Shared language detection — works in browser + Node.
 *
 * Detects Sinhala (Unicode), Tanglish (romanised Sinhala mixed with English),
 * and English. Only these three languages are supported.
 */
import type { Lang } from './types'

// Common Sinhala words written in Latin script (Singlish)
const SINGLISH_HINTS = [
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

// Common Tamil words written in Latin script (Tanglish)
const TANGLISH_HINTS = [
  // common words
  'vanakkam', 'nanri', 'eppadi', 'irukkeenga', 'nalla', 'romba',
  'venum', 'kudu', 'vaanga', 'po', 'sapadu', 'kadai', 'enna',
  'sollu', 'sollunga', 'inga', 'anga', 'ethu', 'edhu', 'yaru',
  'eppo', 'ippo', 'appo', 'panna', 'pannunga',
  // family
  'amma', 'appa', 'annan', 'thambi', 'akka', 'thangachi',
  // shopping
  'vilai', 'vaanganum', 'kondu', 'edutthu', 'vanga',
  // greetings
  'anbu', 'vaazhthukkal', 'iniya',
]

const SI_RE = /[඀-෿]/
const TA_RE = /[\u0B80-\u0BFF]/

/**
 * Detect the language of a text string.
 *
 * Priority:
 *  1. Any Sinhala Unicode character → 'si'
 *  2. Any Tamil Unicode character → 'ta'
 *  3. ≥1 Singlish keyword hit → 'sg'
 *  4. ≥1 Tanglish keyword hit → 'tg'
 *  5. Otherwise → 'en'
 */
export function detectLang(text: string): Lang {
  if (SI_RE.test(text)) return 'si'
  if (TA_RE.test(text)) return 'ta'
  
  const t = ' ' + text.toLowerCase() + ' '
  let sgHits = 0
  for (const w of SINGLISH_HINTS) {
    if (t.includes(' ' + w + ' ') || t.includes(' ' + w + '.') || t.includes(' ' + w + '?') || t.includes(' ' + w + '!')) sgHits++
    else if (t.includes(w)) sgHits += 0.5
  }
  let tgHits = 0
  for (const w of TANGLISH_HINTS) {
    if (t.includes(' ' + w + ' ') || t.includes(' ' + w + '.') || t.includes(' ' + w + '?') || t.includes(' ' + w + '!')) tgHits++
    else if (t.includes(w)) tgHits += 0.5
  }
  
  if (sgHits === 0 && tgHits === 0) return 'en'
  return tgHits > sgHits ? 'tg' : 'sg'
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
  if (detectedLang === 'si' || detectedLang === 'ta' || detectedLang === 'sg' || detectedLang === 'tg') return detectedLang
  // Otherwise honour the header toggle preference
  if (preferredLang === 'si') return 'si'
  return preferredLang ?? 'en'
}
