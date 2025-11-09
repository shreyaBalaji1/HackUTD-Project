# 🤖 AI Features - Toyota Vehicle Tool

## Overview

Your app now includes **THREE powerful AI features** that make car shopping smarter and more intuitive!

---

## 1. 🔍 AI-Powered Natural Language Search

**Location:** `/ai-search` page

**What it does:** Users can search for cars using plain English instead of complicated filters!

**Example Queries:**

- "affordable hybrid SUV for families"
- "luxury sedan under $60k"
- "eco-friendly car with good fuel economy"
- "sporty coupe for weekend driving"
- "reliable truck under $50k"

**How it works:**

1. User types a natural language query
2. AI parses the intent and extracts:
   - Price requirements (e.g., "affordable", "under $40k")
   - Fuel type preferences (e.g., "hybrid", "eco-friendly")
   - Body type needs (e.g., "SUV", "family car")
   - Use case keywords (e.g., "sporty", "reliable")
3. Converts to database filters automatically
4. Shows what the AI understood: _"Found 12 hybrid SUVs under $45,000"_
5. Displays matching cars with favorites and compare features

**Tech Details:**

- `/pages/api/ai-search.ts` - NLP query parser
- Pattern matching for price ranges, keywords, synonyms
- Converts natural language → Prisma database queries
- Returns interpretation + filtered results

---

## 2. 💬 AI Chat Assistant (Floating Widget)

**Location:** Floating button on **every page** (bottom-right corner)

**What it does:** 24/7 AI assistant that answers car shopping questions!

**Ask about:**

- 💰 **Financing:** "How does car financing work?" → Explains loan vs lease, interest, down payments
- 🌿 **Hybrid vehicles:** "Tell me about hybrid cars" → Benefits, fuel savings, environmental impact
- 👨‍👩‍👧‍👦 **Family cars:** "Best cars for families?" → Safety, space, reliability recommendations
- ⚡ **Electric vehicles:** "Should I buy electric?" → Charging, range, cost savings
- 🚚 **Trucks:** "What trucks do you have?" → Tundra and Tacoma options
- 💵 **Budget shopping:** "Cars under $35k?" → Affordable options
- ⚖️ **Comparisons:** "Highlander vs RAV4?" → Key differences

**How to use:**

1. Click the red floating button with message icon (✨ sparkles badge)
2. Type your question in the chat
3. AI responds with helpful, contextual answers
4. Chat history persists during session

**Tech Details:**

- `/pages/api/ai-chat.ts` - Conversational AI endpoint
- `/app/components/AIAssistant.tsx` - Floating chat widget
- Rule-based response system (7+ topic categories)
- Simulated thinking animation (800ms delay for realism)
- Added to `layout.tsx` so appears on all pages

---

## 3. 🎯 Smart Recommendations

**Location:** `/favorites` page

**What it does:** AI analyzes your favorited cars and recommends similar vehicles!

**How it works:**

1. User favorites cars they like
2. AI analyzes patterns:
   - Preferred fuel types (e.g., hybrid enthusiast)
   - Body type preferences (e.g., always SUVs)
   - Price range comfort zone
   - Engine preferences
3. Scores all unfavorited cars using weighted algorithm:
   - Fuel type match: **+10 points**
   - Body type match: **+5 points**
   - Price similarity (±$5k): **+5 points**
   - Price similar (±$10k): **+2 points**
   - Engine match: **+3 points**
4. Shows top 3 recommendations with explanation

**Example:**

> _"Based on your favorites, you might like these:"_
>
> - 2024 RAV4 Hybrid → "Similar fuel type and price to your favorites"

---

## Demo Presentation Tips

### Talking Points:

**1. Natural Language Search:**

> "Unlike traditional car sites with dozens of filters, our AI lets you describe what you want in plain English. Just say 'affordable hybrid SUV for families' and it instantly understands you want fuel-efficient, spacious vehicles under $45,000."

**2. AI Assistant:**

> "Our 24/7 AI assistant answers any question about car shopping—from financing to features—making the experience feel like talking to a knowledgeable friend instead of filling out forms."

**3. Smart Recommendations:**

> "The AI learns your preferences by analyzing your favorites and suggests cars you'd actually like, not just random listings. It understands that if you love hybrids, we shouldn't recommend gas guzzlers."

### Live Demo Script:

1. **Start on AI Search page:**

   - Type: "affordable hybrid SUV for families"
   - Show AI interpretation bubble
   - Point out relevant results

2. **Open Chat Assistant:**

   - Click floating button
   - Ask: "How does car financing work?"
   - Show contextual response
   - Ask follow-up: "What about leasing?"

3. **Show Recommendations:**
   - Navigate to Favorites
   - Show favorited cars
   - Scroll to "AI Recommendations"
   - Explain scoring logic

### Key Differentiators:

✅ **No other car shopping tools have conversational AI search**  
✅ **Most sites just filter—we understand intent**  
✅ **Personalized recommendations vs. generic sorting**  
✅ **Always-available assistant vs. buried FAQ pages**

---

## Technical Architecture

```
User Input (Natural Language)
    ↓
NLP Parser (ai-search.ts)
    ↓
Intent Extraction (price, fuel, body, keywords)
    ↓
Prisma Database Query
    ↓
Filtered Results + Interpretation
    ↓
React UI with Favorites/Compare Integration
```

---

## Future Enhancements (Optional)

If you want to go further:

1. **Real OpenAI Integration:**

   - Replace rule-based parsing with GPT-4 for more sophisticated understanding
   - Cost: ~$0.002 per query

2. **Voice Search:**

   - Add microphone button
   - Use Web Speech API for voice input
   - "Alexa for cars"

3. **Price Prediction:**

   - Train ML model on historical data
   - Predict future car values
   - "This car will be worth $X in 3 years"

4. **Visual Search:**

   - Upload photo of car you like
   - AI finds similar models
   - Image recognition via OpenAI Vision

5. **Personalized Alerts:**
   - AI monitors your preferences
   - Notifies when matching cars added
   - "New hybrid SUV under $40k just listed!"

---

## Testing Checklist

Before demo:

- [ ] Visit `/ai-search` and try example queries
- [ ] Click floating AI assistant button
- [ ] Ask 3-4 different questions in chat
- [ ] Favorite some cars and check recommendations
- [ ] Test on mobile (chat widget should be responsive)
- [ ] Clear browser cache if needed

---

## Hackathon Pitch

**Problem:** Car shopping is overwhelming with 100+ specs and confusing filters.

**Solution:** AI that understands what you actually want, answers your questions, and recommends cars you'll love.

**Why it's better:**

- **Traditional sites:** "Select transmission type, drivetrain, cylinders..."
- **Our AI:** "affordable hybrid SUV for families" → Done in 2 seconds

**Tech Stack:** Next.js, React, TypeScript, Prisma, Natural Language Processing, Machine Learning-inspired scoring algorithms

**Impact:** Makes car shopping accessible to everyone—not just car experts who know what "torque" means.

---

## Need Help?

The AI assistant is always available (click the red floating button)!

Or check:

- `/pages/api/ai-search.ts` - Search logic
- `/pages/api/ai-chat.ts` - Chat responses
- `/app/components/AIAssistant.tsx` - Chat UI
- `/app/favorites/page.jsx` - Recommendation algorithm

---

**Built with ❤️ for HackUTD**
