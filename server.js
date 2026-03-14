/**
 * TextShield API — Humanizer, AI Detector, Plagiarism Checker
 * Pure rule-based NLP. No external AI APIs required.
 * Run: node server.js
 */
 
const http = require("http");
const url = require("url");
 
// ─────────────────────────────────────────────
//  NLP UTILITIES
// ─────────────────────────────────────────────
 
const SYNONYMS = {
  utilize: ["use", "apply", "employ", "leverage"],
  implement: ["use", "carry out", "apply", "set up", "put in place"],
  facilitate: ["help", "support", "make possible", "enable"],
  demonstrate: ["show", "prove", "illustrate", "reveal"],
  significant: ["major", "big", "important", "key"],
  substantial: ["large", "considerable", "sizable", "major"],
  numerous: ["many", "several", "a lot of", "quite a few"],
  commence: ["begin", "start", "kick off"],
  terminate: ["end", "stop", "finish", "wrap up"],
  additional: ["more", "extra", "further", "added"],
  obtain: ["get", "receive", "acquire", "gain"],
  purchase: ["buy", "pick up", "get"],
  provide: ["give", "offer", "supply", "deliver"],
  ensure: ["make sure", "confirm", "verify", "guarantee"],
  require: ["need", "call for", "demand"],
  consider: ["think about", "look at", "weigh", "reflect on"],
  regarding: ["about", "on", "concerning", "when it comes to"],
  therefore: ["so", "thus", "as a result", "that's why"],
  however: ["but", "yet", "still", "that said"],
  furthermore: ["also", "on top of that", "what's more", "plus"],
  additionally: ["also", "besides", "on top of that", "and"],
  subsequently: ["then", "after that", "later", "next"],
  currently: ["now", "right now", "at the moment", "these days"],
  previously: ["before", "earlier", "in the past", "once"],
  approximately: ["about", "around", "roughly", "nearly"],
  sufficient: ["enough", "adequate", "plenty of"],
  innovative: ["new", "fresh", "creative", "original"],
  comprehensive: ["complete", "thorough", "full", "wide-ranging"],
  effective: ["useful", "powerful", "practical", "efficient"],
  efficient: ["fast", "streamlined", "quick", "productive"],
  essential: ["key", "vital", "critical", "important"],
  incorporate: ["include", "add", "bring in", "fold in"],
  leverage: ["use", "tap into", "make use of", "draw on"],
  enhance: ["improve", "boost", "strengthen", "upgrade"],
  crucial: ["key", "important", "critical", "essential"],
  vital: ["key", "critical", "necessary", "important"],
  paramount: ["key", "top", "most important", "critical"],
  significant: ["major", "big", "real"],
  profound: ["deep", "major", "big", "strong"],
  remarkable: ["impressive", "surprising", "striking", "great"],
  substantial: ["large", "major", "big", "real"],
  pivotal: ["key", "turning-point", "crucial", "defining"],
  holistic: ["overall", "complete", "whole", "full"],
  nuanced: ["subtle", "complex", "layered", "detailed"],
  foster: ["build", "grow", "support", "encourage"],
  underscore: ["highlight", "show", "stress", "point to"],
  stakeholder: ["person involved", "party", "interested party", "member"],
  leverage: ["use", "apply", "draw on", "tap into"],
  innovative: ["new", "fresh", "creative", "novel"],
  seamlessly: ["smoothly", "easily", "without trouble"],
  robust: ["solid", "strong", "reliable", "sturdy"],
  optimal: ["best", "ideal", "top", "most effective"],
  facilitate: ["help", "support", "make possible", "enable"],
  demonstrate: ["show", "prove", "illustrate", "make clear"],
  optimise: ["improve", "fine-tune", "refine", "streamline"],
  optimize: ["improve", "fine-tune", "refine", "streamline"],
  highlight: ["point out", "stress", "emphasize", "note"],
  emphasize: ["stress", "highlight", "underline", "focus on"],
  prioritize: ["focus on", "put first", "rank first", "value most"],
  acknowledge: ["admit", "accept", "recognize", "note"],
  indicate: ["show", "suggest", "point to", "signal"],
  maintain: ["keep", "hold", "preserve", "sustain"],
  establish: ["set up", "create", "build", "form"],
  investigate: ["look into", "explore", "examine", "study"],
  analyse: ["study", "look at", "examine", "break down"],
  analyze: ["study", "look at", "examine", "break down"],
};
 
// Phrases typical of AI-generated text → human replacements
const PHRASE_REPLACEMENTS = [
  [/\bit's worth pointing out\b/gi, "it's good to note"],
  [/\bdemonstr(ate|ates|ated|ating|ation)\b/gi, (m) => ({ demonstrate:"show", demonstrates:"shows", demonstrated:"showed", demonstrating:"showing", demonstration:"example" })[m.toLowerCase()] || "show"],
  [/\bsubstantially\b/gi, "a lot"],
  [/\bsignificantly\b/gi, "a lot"],
  [/\bit's worth pointing out that\b/gi, "worth pointing out:"],
  [/\butiliz(e|es|ed|ing|ation)\b/gi, (m) => ({ utilize:"use", utilizes:"uses", utilized:"used", utilizing:"using", utilization:"use" })[m.toLowerCase()] || "use"],
  [/\bMoreover,\s*/g, "Also, "],
  [/\bmoreover,\s*/g, "also, "],
  [/\bFurthermore,\s*/g, "Plus, "],
  [/\bfurthermore,\s*/g, "plus, "],
  [/\bAdditionally,\s*/g, "And, "],
  [/\badditionally,\s*/g, "and, "],
  [/\bNevertheless,\s*/g, "Still, "],
  [/\bnevertheless,\s*/g, "still, "],
  [/\bNotwithstanding,\s*/g, "Even so, "],
  [/\bnotwithstanding,\s*/g, "even so, "],
  [/\bSubsequently,\s*/g, "After that, "],
  [/\bsubsequently,\s*/g, "after that, "],
  [/\bConsequently,\s*/g, "As a result, "],
  [/\bconsequently,\s*/g, "as a result, "],
  [/\bThus,\s*/g, "So, "],
  [/\bthus,\s*/g, "so, "],
  [/\bHence,\s*/g, "So, "],
  [/\bhence,\s*/g, "so, "],
  [/\bAlbeit\b/gi, "although"],
  [/\bWhereas\b/gi, "while"],
  [/\bnotable\b/gi, "real"],
  [/\bseamless integration\b/gi, "easy adoption"],
  [/\bseamless(ly)?\b/gi, "smooth"],
  [/\binnovative solutions\b/gi, "new tools"],
  [/\bto leverage\b/gi, "to use"],
  [/\bcan leverage\b/gi, "can use"],
  [/\bthese innovative solutions leverage\b/gi, "these new tools use"],
  [/\bfacilitate optimal\b/gi, "achieve the best"],
  [/\bmust therefore\b/gi, "should"],
  [/\bmust thus\b/gi, "should"],
  [/\bwill therefore\b/gi, "will"],
  [/\ball stakeholders\b/gi, "everyone involved"],
  [/\bfor all stakeholders\b/gi, "for everyone"],
  [/\bin the realm of\b/gi, "within"],
  [/\bit is worth noting that\b/gi, "it's worth noting that"],
  [/\bit is important to note that\b/gi, "it's worth pointing out that"],
  [/\bit is essential to\b/gi, "you need to"],
  [/\bone must\b/gi, "you should"],
  [/\bone can\b/gi, "you can"],
  [/\bthis can be attributed to\b/gi, "this is because"],
  [/\bin order to\b/gi, "to"],
  [/\bdue to the fact that\b/gi, "because"],
  [/\bin the event that\b/gi, "if"],
  [/\bat this point in time\b/gi, "now"],
  [/\bin close proximity\b/gi, "nearby"],
  [/\bprior to\b/gi, "before"],
  [/\bsubsequent to\b/gi, "after"],
  [/\bin spite of\b/gi, "despite"],
  [/\bwith regard to\b/gi, "about"],
  [/\bin terms of\b/gi, "for"],
  [/\bfor the purpose of\b/gi, "to"],
  [/\bthe fact that\b/gi, "that"],
  [/\bis able to\b/gi, "can"],
  [/\bare able to\b/gi, "can"],
  [/\bwas able to\b/gi, "could"],
  [/\bwere able to\b/gi, "could"],
  [/\bmake use of\b/gi, "use"],
  [/\btake into consideration\b/gi, "consider"],
  [/\btake into account\b/gi, "account for"],
  [/\bplay a role in\b/gi, "affect"],
  [/\bplay a crucial role\b/gi, "matter a lot"],
  [/\bin light of\b/gi, "given"],
  [/\ba variety of\b/gi, "various"],
  [/\ba wide range of\b/gi, "many"],
  [/\ba number of\b/gi, "several"],
  [/\bthe majority of\b/gi, "most"],
  [/\bthe ability to\b/gi, "the power to"],
  [/\bhas the potential to\b/gi, "could"],
  [/\bserves as\b/gi, "acts as"],
  [/\bultimately\b/gi, "in the end"],
  [/\bin conclusion,?\s*/gi, "To wrap up, "],
  [/\bin summary,?\s*/gi, "In short, "],
  [/\bto summarize,?\s*/gi, "Basically, "],
  [/\bit should be noted\b/gi, "note that"],
  [/\bgoing forward\b/gi, "from now on"],
  [/\bmoving forward\b/gi, "from here"],
  [/\bleverag(e|ing)\b/gi, (m) => m.toLowerCase().endsWith("ing") ? "using" : "use"],
  [/\bsynergy\b/gi, "teamwork"],
  [/\bparadigm\b/gi, "model"],
  [/\bbest practices\b/gi, "proven methods"],
  [/\bstate-of-the-art\b/gi, "modern"],
  [/\bcutting-edge\b/gi, "latest"],
  [/\bholistic approach\b/gi, "full picture"],
  [/\binnovative solution(s)?\b/gi, "new approach"],
  [/\bone must\b/gi, "you should"],
  [/\bone should\b/gi, "you should"],
  [/\bone can\b/gi, "you can"],
  [/\bstakeholders?\b/gi, "everyone involved"],
  [/\bfoster(s|ing)?/gi, "build"],
  [/\bunderscores?\b/gi, "shows"],
  [/\bnuanced?\b/gi, "subtle"],
  [/\bpivotal\b/gi, "key"],
  [/\bparamount\b/gi, "most important"],
  [/\bprofound(ly)?\b/gi, "deep"],
  [/\bremarkably?\b/gi, "worth noting"],
  [/\bit is (crucial|vital|essential|necessary|important) to\b/gi, "you need to"],
  [/\bplays? a (crucial|key|vital|important|significant) role\b/gi, "matters a lot"],
  [/\bthis (essay|article|paper|analysis)\b/gi, "this"],
  [/\bin (today's|modern|contemporary) (world|society|landscape|era)\b/gi, "today"],
  [/\bholistic\b/gi, "complete"],
  [/\bseamlessly\b/gi, "smoothly"],
  [/\brobust\b/gi, "solid"],
  [/\bcutting-edge\b/gi, "modern"],
  [/\bstate-of-the-art\b/gi, "advanced"],
  [/\bbest-in-class\b/gi, "top-quality"],
  [/\bdelve into\b/gi, "explore"],
  [/\bunpack\b/gi, "look at"],
  [/\bnavigate\b/gi, "work through"],
  [/\btackle\b/gi, "handle"],
];
 
// AI writing style signatures (for detection)
const AI_SIGNALS = [
  /\bdelve\b/i,
  /\bunpack\b/i,
  /\bin the realm of\b/i,
  /\bit is worth noting\b/i,
  /\bit is important to note\b/i,
  /\bfurthermore,/i,
  /\bmoreover,/i,
  /\badditionally,/i,
  /\bnevertheless,/i,
  /\bnotwithstanding\b/i,
  /\bsubstantially\b/i,
  /\bcomprehensive(ly)?\b/i,
  /\bfacilitate\b/i,
  /\butilize\b/i,
  /\boptimal(ly)?\b/i,
  /\bseamlessly\b/i,
  /\bintricate(ly)?\b/i,
  /\btapestry\b/i,
  /\bcommence\b/i,
  /\bembark\b/i,
  /\bjourney\b/i,
  /\bin conclusion,/i,
  /\bin summary,/i,
  /\bto summarize\b/i,
  /\bassist\b/i,
  /\bultimately\b/i,
  /\bleverage\b/i,
  /\bdemonstrate\b/i,
  /\benhance\b/i,
  /\bensure\b/i,
  /\binnovative solution\b/i,
  /\bbest practices\b/i,
  /\bmoving forward\b/i,
  /\bgoing forward\b/i,
  /\bcutting-edge\b/i,
  /\bstate-of-the-art\b/i,
  /\bholistic approach\b/i,
  /\brobust\b/i,
  /\bsynergy\b/i,
  /\bparadigm\b/i,
  /\bpivotal\b/i,
  /\bcrucial\b/i,
  /\bvital\b/i,
  /\bparamount\b/i,
  /\bprofound(ly)?\b/i,
  /\bsubstantial(ly)?\b/i,
  /\bnotably\b/i,
  /\bsignificant(ly)?\b/i,
  /\bremark(able|ably)\b/i,
  /\bthis (essay|article|paper|analysis|study)\b/i,
  /\bin (today's|modern|contemporary) (world|society|landscape|era)\b/i,
  /\bone (must|should|can|cannot)\b/i,
  /\bwhen it comes to\b/i,
  /\bit (is|was) (essential|crucial|vital|important|necessary) to\b/i,
  /\bplays? a (crucial|key|vital|important|significant) role\b/i,
  /\bunderscor(e|es|ing)\b/i,
  /\bfoster(s|ing)?\b/i,
  /\bnuanced?\b/i,
  /\bemphas(ize|ises?|izing)\b/i,
  /\bstakeholder(s)?\b/i,
  /\bsynthesize\b/i,
  /\bintricac(y|ies)\b/i,
  /\bin this (context|regard|case|instance)\b/i,
  /\bthrough(out)? (this|the) (essay|article|analysis|paper)\b/i,
  /\bof (great|utmost|paramount) importance\b/i,
  /\bworthwhile\b/i,
  /\bpresents? (a|an) (unique|compelling|interesting|significant)\b/i,
];
 
// Contractions map for humanizing formal text
const CONTRACTIONS = [
  [/\bI am\b/g, "I'm"],
  [/\bI have\b/g, "I've"],
  [/\bI will\b/g, "I'll"],
  [/\bI would\b/g, "I'd"],
  [/\byou are\b/gi, "you're"],
  [/\byou have\b/gi, "you've"],
  [/\byou will\b/gi, "you'll"],
  [/\byou would\b/gi, "you'd"],
  [/\bwe are\b/gi, "we're"],
  [/\bwe have\b/gi, "we've"],
  [/\bwe will\b/gi, "we'll"],
  [/\bwe would\b/gi, "we'd"],
  [/\bthey are\b/gi, "they're"],
  [/\bthey have\b/gi, "they've"],
  [/\bthey will\b/gi, "they'll"],
  [/\bit is\b/gi, "it's"],
  [/\bit has\b/gi, "it's"],
  [/\bit will\b/gi, "it'll"],
  [/\bthat is\b/gi, "that's"],
  [/\bthat will\b/gi, "that'll"],
  [/\bthere is\b/gi, "there's"],
  [/\bthere are\b/g, "there are"],
  [/\bdo not\b/gi, "don't"],
  [/\bdoes not\b/gi, "doesn't"],
  [/\bdid not\b/gi, "didn't"],
  [/\bwill not\b/gi, "won't"],
  [/\bwould not\b/gi, "wouldn't"],
  [/\bcould not\b/gi, "couldn't"],
  [/\bshould not\b/gi, "shouldn't"],
  [/\bcannot\b/gi, "can't"],
  [/\bis not\b/gi, "isn't"],
  [/\bare not\b/gi, "aren't"],
  [/\bwas not\b/gi, "wasn't"],
  [/\bwere not\b/gi, "weren't"],
  [/\bhave not\b/gi, "haven't"],
  [/\bhas not\b/gi, "hasn't"],
  [/\bhad not\b/gi, "hadn't"],
];
 
// ─────────────────────────────────────────────
//  CORE ENGINE: HUMANIZER
// ─────────────────────────────────────────────
 
function humanizeText(text) {
  let result = text;
 
  // 1. Apply phrase-level replacements first (longest match first)
  for (const [pattern, replacement] of PHRASE_REPLACEMENTS) {
    result = result.replace(pattern, replacement);
  }
 
  // 2. Replace formal synonyms word by word
  result = result.replace(/\b([a-zA-Z]+)\b/g, (word) => {
    const lower = word.toLowerCase();
    if (SYNONYMS[lower]) {
      const options = SYNONYMS[lower];
      const replacement = options[Math.floor(Math.random() * options.length)];
      // preserve original capitalisation
      if (word[0] === word[0].toUpperCase() && word[0] !== word[0].toLowerCase()) {
        return replacement.charAt(0).toUpperCase() + replacement.slice(1);
      }
      return replacement;
    }
    return word;
  });
 
  // 3. Apply contractions
  for (const [pattern, replacement] of CONTRACTIONS) {
    result = result.replace(pattern, replacement);
  }
 
  // 4. Vary sentence openers — handle transitional starters not already replaced
  result = result
    .replace(/^(Furthermore|Moreover|Additionally|However|Nevertheless|Notwithstanding),?\s+/gim, (_, word) => {
      const casual = { Furthermore: "Also,", Moreover: "Plus,", Additionally: "And,", However: "But,", Nevertheless: "Still,", Notwithstanding: "Even so," };
      return (casual[word] || word) + " ";
    });
 
  // 5. Break overly long sentences (>40 words) at conjunctions
  result = result.replace(/([^.!?]{200,}?)(\s+(?:and|but|which|that|because|so|although)\s+)/gi, (match, before, conj) => {
    const trimConj = conj.trim();
    const starters = { and: "Also,", but: "But", which: "This", that: "That", because: "This is because", so: "So", although: "Although" };
    return before + ". " + (starters[trimConj.toLowerCase()] || trimConj.charAt(0).toUpperCase() + trimConj.slice(1)) + " ";
  });
 
  // 7. Re-capitalise sentence starts (replacements may have lowercased them)
  result = result.replace(/(^|[.!?]\s+)([a-z])/g, (match, sep, letter) => sep + letter.toUpperCase());
 
  // 8. Clean up any double spaces or punctuation artifacts
  result = result
    .replace(/  +/g, " ")
    .replace(/,\s*,/g, ",")
    .replace(/\.\s*\./g, ".")
    .trim();
 
  return result;
}
 
// ─────────────────────────────────────────────
//  CORE ENGINE: AI DETECTOR
// ─────────────────────────────────────────────
 
function detectAI(text) {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const words = text.toLowerCase().split(/\s+/);
  const wordCount = words.length;
 
  // Signal 1: AI keyword density
  let signalHits = 0;
  const matchedSignals = [];
  for (const pattern of AI_SIGNALS) {
    if (pattern.test(text)) {
      signalHits++;
      matchedSignals.push(pattern.source.replace(/\\b/g, "").replace(/[()\/?]/g, "").trim());
    }
  }
  // Score by density per 100 words (5 hits per 100 words = very AI-like)
  const signalDensity = (signalHits / Math.max(wordCount, 1)) * 100;
  const signalScore = Math.min(signalDensity / 5, 1);
 
  // Signal 2: Sentence length uniformity (AI tends to be very uniform)
  const sentLengths = sentences.map((s) => s.trim().split(/\s+/).length);
  const avgLen = sentLengths.reduce((a, b) => a + b, 0) / sentLengths.length;
  const variance = sentLengths.reduce((a, b) => a + Math.pow(b - avgLen, 2), 0) / sentLengths.length;
  const stdDev = Math.sqrt(variance);
  // Low std deviation = uniform = more AI-like
  const uniformityScore = Math.max(0, 1 - stdDev / 8);
 
  // Signal 3: Passive voice density
  const passiveMatches = text.match(/\b(is|are|was|were|be|been|being)\s+\w+ed\b/gi) || [];
  const passiveScore = Math.min(passiveMatches.length / Math.max(sentences.length, 1) / 0.5, 1);
 
  // Signal 4: Transition word density
  const transitionWords = text.match(/\b(furthermore|moreover|additionally|nevertheless|notwithstanding|subsequently|consequently|therefore|thus|hence|whereas|albeit)\b/gi) || [];
  const transitionScore = Math.min(transitionWords.length / Math.max(wordCount / 100, 1) / 3, 1);
 
  // Signal 5: Repeated structure — check for similar sentence starters
  const starters = sentences.map((s) => s.trim().split(/\s+/).slice(0, 2).join(" ").toLowerCase());
  const uniqueStarters = new Set(starters).size;
  const repetitionScore = sentences.length > 3 ? Math.max(0, 1 - uniqueStarters / sentences.length) : 0;
 
  // Signal 6: Lexical richness (AI often has high vocabulary diversity but low colloquialism)
  const uniqueWords = new Set(words.filter((w) => w.length > 3)).size;
  const lexicalRichness = uniqueWords / Math.max(wordCount, 1);
  // Moderate-high richness (0.5-0.75) is AI-like
  const lexScore = lexicalRichness > 0.45 && lexicalRichness < 0.8 ? 0.5 : 0.2;
 
  // Signal 7: Formal phrase patterns (collocations typical in AI)
  const formalPhrases = text.match(/\b(play(s)? a (crucial|key|vital|important|significant) role|best practices|going forward|moving forward|in the context of|with respect to|it is (worth|important) (noting|to note)|state.of.the.art|cutting.edge|innovative solution|holistic approach|key takeaway|at the end of the day|in order to|due to the fact that|it should be noted|as previously mentioned|in this (essay|article|paper)|when it comes to)\b/gi) || [];
  const formalScore = Math.min(formalPhrases.length * 0.25, 1);
 
  // Weighted composite score
  // uniformity alone can't drive a high score — only meaningful combined with other signals
  const hasOtherSignals = signalScore > 0.1 || transitionScore > 0.1 || formalScore > 0.1;
  const adjustedUniformity = hasOtherSignals ? uniformityScore : uniformityScore * 0.25;
 
  const aiProbability =
    signalScore * 55 +
    adjustedUniformity * 12 +
    passiveScore * 10 +
    transitionScore * 18 +
    repetitionScore * 7 +
    lexScore * 3 +
    formalScore * 8;
 
  const aiPercent = Math.min(Math.max(Math.round(aiProbability), 0), 100);
 
  return {
    aiProbability: aiPercent,
    humanProbability: 100 - aiPercent,
    verdict: aiPercent >= 60 ? "AI Generated" : aiPercent >= 35 ? "Likely AI / Mixed" : aiPercent >= 15 ? "Possibly Human" : "Human Written",
    confidence: aiPercent >= 65 || aiPercent <= 10 ? "High" : aiPercent >= 40 || aiPercent <= 20 ? "Medium" : "Low",
    signals: {
      aiKeywordDensity: Math.round(signalScore * 100),
      sentenceUniformity: Math.round(uniformityScore * 100),
      passiveVoice: Math.round(passiveScore * 100),
      transitionWordOveruse: Math.round(transitionScore * 100),
      structureRepetition: Math.round(repetitionScore * 100),
      formalPhraseUsage: Math.round(formalScore * 100),
    },
    detectedKeywords: [...new Set(matchedSignals)].slice(0, 10),
    wordCount,
    sentenceCount: sentences.length,
    avgWordsPerSentence: Math.round(avgLen),
  };
}
 
// ─────────────────────────────────────────────
//  CORE ENGINE: PLAGIARISM CHECKER
// ─────────────────────────────────────────────
 
// Simulates structural plagiarism analysis (n-gram fingerprinting)
// In production, wire this to a real corpus/search index.
function checkPlagiarism(text, compareTexts = []) {
  const normalize = (t) =>
    t
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, " ")
      .trim();
 
  const getNgrams = (text, n) => {
    const words = normalize(text).split(" ");
    const grams = [];
    for (let i = 0; i <= words.length - n; i++) {
      grams.push(words.slice(i, i + n).join(" "));
    }
    return new Set(grams);
  };
 
  // Fingerprint the input
  const trigrams = getNgrams(text, 3);
  const fivegrams = getNgrams(text, 5);
  const wordSet = new Set(normalize(text).split(" ").filter((w) => w.length > 4));
 
  // Structural analysis: detect copy-paste patterns
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
 
  let similarities = [];
 
  if (compareTexts.length > 0) {
    // Compare against provided texts
    for (let i = 0; i < compareTexts.length; i++) {
      const compareTrigrams = getNgrams(compareTexts[i], 3);
      const compareFivegrams = getNgrams(compareTexts[i], 5);
 
      const trigramOverlap = [...trigrams].filter((g) => compareTrigrams.has(g)).length;
      const fivegramOverlap = [...fivegrams].filter((g) => compareFivegrams.has(g)).length;
 
      const trigramSim = trigrams.size > 0 ? trigramOverlap / trigrams.size : 0;
      const fivegramSim = fivegrams.size > 0 ? fivegramOverlap / fivegrams.size : 0;
 
      const simScore = Math.round((trigramSim * 0.4 + fivegramSim * 0.6) * 100);
 
      if (simScore > 5) {
        similarities.push({
          source: `Document ${i + 1}`,
          similarity: simScore,
          matchedPhrases: [...fivegrams]
            .filter((g) => compareFivegrams.has(g))
            .slice(0, 3)
            .map((g) => `"...${g}..."`),
        });
      }
    }
  } else {
    // Internal analysis: detect self-repetition and formulaic phrasing
    // Check for repeated sentences/phrases within the document
    const sentenceHashes = sentences.map((s) => normalize(s));
    const seen = new Map();
    const internalDups = [];
 
    for (const s of sentenceHashes) {
      const words = s.split(" ");
      for (let n = 5; n <= Math.min(words.length, 10); n++) {
        for (let i = 0; i <= words.length - n; i++) {
          const gram = words.slice(i, i + n).join(" ");
          if (seen.has(gram)) {
            internalDups.push(gram);
          } else {
            seen.set(gram, true);
          }
        }
      }
    }
 
    const uniqueDups = [...new Set(internalDups)];
 
    // Estimate originality score
    const repetitionRate = uniqueDups.length / Math.max(trigrams.size, 1);
    const internalScore = Math.min(Math.round(repetitionRate * 80), 30);
 
    if (internalScore > 5) {
      similarities.push({
        source: "Internal repetition",
        similarity: internalScore,
        matchedPhrases: uniqueDups.slice(0, 3).map((g) => `"...${g}..."`),
      });
    }
  }
 
  const maxSimilarity = similarities.length > 0 ? Math.max(...similarities.map((s) => s.similarity)) : 0;
  const overallScore = compareTexts.length > 0 ? maxSimilarity : Math.min(maxSimilarity, 25);
 
  return {
    originalityScore: 100 - overallScore,
    plagiarismScore: overallScore,
    verdict:
      overallScore >= 70
        ? "Heavily Plagiarised"
        : overallScore >= 40
        ? "Significant Plagiarism"
        : overallScore >= 20
        ? "Moderate Similarity"
        : overallScore >= 10
        ? "Minor Similarity"
        : "Original",
    matches: similarities.sort((a, b) => b.similarity - a.similarity),
    analysis: {
      uniqueTrigramCount: trigrams.size,
      totalSentences: sentences.length,
      avgSentenceLength: Math.round(
        sentences.map((s) => s.split(/\s+/).length).reduce((a, b) => a + b, 0) / Math.max(sentences.length, 1)
      ),
      note:
        compareTexts.length === 0
          ? "No comparison documents provided. Analysis is based on internal structure. For full plagiarism detection, provide comparison texts in the 'compareTexts' array."
          : `Compared against ${compareTexts.length} document(s).`,
    },
  };
}
 
// ─────────────────────────────────────────────
//  HTTP SERVER
// ─────────────────────────────────────────────
 
function sendJSON(res, status, data) {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(JSON.stringify(data, null, 2));
}
 
function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk.toString()));
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("Invalid JSON body"));
      }
    });
    req.on("error", reject);
  });
}
 
const server = http.createServer(async (req, res) => {
  const parsed = url.parse(req.url, true);
  const pathname = parsed.pathname;
 
  // CORS preflight
  if (req.method === "OPTIONS") {
    res.writeHead(204, { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type" });
    return res.end();
  }
 
  // ── GET /  (health + docs) ──────────────────
  if (req.method === "GET" && pathname === "/") {
    return sendJSON(res, 200, {
      name: "TextShield API",
      version: "1.0.0",
      description: "Rule-based NLP: AI humanizer, AI detector, plagiarism checker",
      endpoints: {
        "POST /humanize": {
          description: "Convert AI-generated text to human-sounding text",
          body: { text: "string (required)" },
          returns: { humanizedText: "string", changesCount: "number", original: "string" },
        },
        "POST /detect": {
          description: "Detect whether text is AI-generated",
          body: { text: "string (required)" },
          returns: { aiProbability: "0-100", humanProbability: "0-100", verdict: "string", signals: "object" },
        },
        "POST /plagiarism": {
          description: "Check text for plagiarism",
          body: { text: "string (required)", compareTexts: "string[] (optional)" },
          returns: { originalityScore: "0-100", plagiarismScore: "0-100", verdict: "string", matches: "array" },
        },
        "POST /analyze": {
          description: "Run all three checks at once",
          body: { text: "string (required)", compareTexts: "string[] (optional)" },
          returns: { humanize: "object", detect: "object", plagiarism: "object" },
        },
      },
    });
  }
 
  // ── POST /humanize ──────────────────────────
  if (req.method === "POST" && pathname === "/humanize") {
    try {
      const body = await readBody(req);
      if (!body.text || typeof body.text !== "string") {
        return sendJSON(res, 400, { error: "Missing or invalid 'text' field" });
      }
      if (body.text.trim().length < 10) {
        return sendJSON(res, 400, { error: "Text too short (minimum 10 characters)" });
      }
 
      const original = body.text;
      const humanized = humanizeText(original);
 
      // Count actual changes
      const origWords = original.split(/\s+/);
      const newWords = humanized.split(/\s+/);
      let changes = 0;
      const maxLen = Math.max(origWords.length, newWords.length);
      for (let i = 0; i < maxLen; i++) {
        if (origWords[i] !== newWords[i]) changes++;
      }
 
      return sendJSON(res, 200, {
        success: true,
        original,
        humanizedText: humanized,
        changesCount: changes,
        changeRate: Math.round((changes / origWords.length) * 100) + "%",
        wordCount: newWords.length,
      });
    } catch (e) {
      return sendJSON(res, 400, { error: e.message });
    }
  }
 
  // ── POST /detect ───────────────────────────
  if (req.method === "POST" && pathname === "/detect") {
    try {
      const body = await readBody(req);
      if (!body.text || typeof body.text !== "string") {
        return sendJSON(res, 400, { error: "Missing or invalid 'text' field" });
      }
      if (body.text.trim().split(/\s+/).length < 20) {
        return sendJSON(res, 400, { error: "Text too short for reliable detection (minimum ~20 words)" });
      }
 
      const result = detectAI(body.text);
      return sendJSON(res, 200, { success: true, ...result });
    } catch (e) {
      return sendJSON(res, 400, { error: e.message });
    }
  }
 
  // ── POST /plagiarism ───────────────────────
  if (req.method === "POST" && pathname === "/plagiarism") {
    try {
      const body = await readBody(req);
      if (!body.text || typeof body.text !== "string") {
        return sendJSON(res, 400, { error: "Missing or invalid 'text' field" });
      }
      if (body.text.trim().length < 50) {
        return sendJSON(res, 400, { error: "Text too short for plagiarism analysis (minimum 50 characters)" });
      }
 
      const compareTexts = Array.isArray(body.compareTexts) ? body.compareTexts.filter((t) => typeof t === "string") : [];
      const result = checkPlagiarism(body.text, compareTexts);
      return sendJSON(res, 200, { success: true, ...result });
    } catch (e) {
      return sendJSON(res, 400, { error: e.message });
    }
  }
 
  // ── POST /analyze (all-in-one) ─────────────
  if (req.method === "POST" && pathname === "/analyze") {
    try {
      const body = await readBody(req);
      if (!body.text || typeof body.text !== "string") {
        return sendJSON(res, 400, { error: "Missing or invalid 'text' field" });
      }
 
      const compareTexts = Array.isArray(body.compareTexts) ? body.compareTexts.filter((t) => typeof t === "string") : [];
 
      const original = body.text;
      const humanized = humanizeText(original);
      const origWords = original.split(/\s+/);
      const newWords = humanized.split(/\s+/);
      let changes = 0;
      const maxLen = Math.max(origWords.length, newWords.length);
      for (let i = 0; i < maxLen; i++) {
        if (origWords[i] !== newWords[i]) changes++;
      }
 
      return sendJSON(res, 200, {
        success: true,
        humanize: {
          original,
          humanizedText: humanized,
          changesCount: changes,
          changeRate: Math.round((changes / origWords.length) * 100) + "%",
        },
        detect: detectAI(original),
        plagiarism: checkPlagiarism(original, compareTexts),
      });
    } catch (e) {
      return sendJSON(res, 400, { error: e.message });
    }
  }
 
  // 404
  return sendJSON(res, 404, { error: "Endpoint not found", availableEndpoints: ["/", "/humanize", "/detect", "/plagiarism", "/analyze"] });
});
 
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`\n  TextShield API running on http://localhost:${PORT}`);
  console.log(`  Endpoints: GET / | POST /humanize | POST /detect | POST /plagiarism | POST /analyze\n`);
});
 
module.exports = { humanizeText, detectAI, checkPlagiarism };
