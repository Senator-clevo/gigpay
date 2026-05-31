# GigPay — Session Context Document
> Paste this at the start of every new Claude session to get fully caught up instantly.

---

## What is GigPay?
GigPay is a secure escrow payment platform built specifically for Nigerian freelancers and gig workers. Clients pay upfront into escrow, funds are held securely, and released to the worker after delivery. Think Paystack meets Fiverr — but laser-focused on Nigeria's gig economy.

**Tagline:** Get Paid. On Time. Every Time.
**Live URL:** https://gigpay-one.vercel.app
**GitHub:** https://github.com/Senator-clevo/gigpay

---

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | Next.js (App Router) + TypeScript |
| Styling | Tailwind CSS |
| Backend/DB | Supabase (auth + database) |
| Payments | Payaza (currently TEST mode — not live) |
| AI Feature | Gemini API (job description generator) |
| Hosting | Vercel |

---

## What's Built
- ✅ Landing page with strong copy
- ✅ Signup flow (2-step: personal details → account setup)
- ✅ Login page
- ✅ Dashboard (shows worker name, details, job creation)
- ✅ Job creation flow
- ✅ Payaza checkout (opens and processes in test mode)
- ✅ AI job description generator (basic Gemini prompting)
- ✅ Supabase auth and database

---

## What's Broken / Needs Work
- ❌ **PRIORITY 1:** Payment status not updating in dashboard after client pays — Payaza webhook not writing back to Supabase
- ❌ **PRIORITY 2:** Still on Payaza TEST keys — need to create Payaza account, complete KYC, switch to live keys
- ❌ **PRIORITY 3:** UI/UX needs full overhaul — needs to feel like a real fintech app
- ❌ **PRIORITY 4:** AI job description generator is too basic — needs better prompting
- ❌ **PRIORITY 5:** No mobile app yet — need React Native with Expo

---

## Roadmap (in order)
### Phase 1 — Fix & Go Live
- Fix Payaza webhook → Supabase payment status update
- Create Payaza account + complete KYC
- Switch to live keys
- Process real ₦ transactions

### Phase 2 — Trust & Credibility
- Freelancer profile visible on payment page (jobs done, earnings, rating)
- Income history dashboard
- Ratings system

### Phase 3 — UI/UX Overhaul
- Full redesign to feel like a real fintech product (think Paystack/OPay quality)
- Better mobile responsiveness

### Phase 4 — Mobile App
- React Native with Expo
- NFC tap-to-pay (Web NFC API on Android Chrome)
- iOS support via Expo Go for testing

### Phase 5 — B2B API
- GigPay escrow as an API for other businesses/marketplaces
- Developer docs + pricing tiers

### Phase 6 — Credit Scoring
- Partner with microfinance institution
- Offer loans backed by GigPay transaction history

---

## Key Competitors (Nigeria)
| Competitor | What they do | GigPay's edge |
|-----------|-------------|---------------|
| Pandascrow | General escrow (not gig-specific) | GigPay is built for gig workers specifically |
| EscrowPay | WhatsApp-based, 2.3% fee | GigPay has AI job briefs + credibility profiles |
| Payluk | General escrow fintech | GigPay has income history + credit scoring vision |
| Sanwo | Two-tier escrow for businesses | GigPay has NFC tap-to-pay roadmap |

**GigPay's unique advantages:**
1. Built specifically for gig workers (not a general escrow tool)
2. AI job description generator (no competitor has this)
3. Income history → credit scoring vision
4. NFC tap-to-pay (planned — nobody in Nigeria has this)
5. Freelancer credibility profile visible to clients at payment time

---

## Immediate Next Steps (start here)
1. Fix the Payaza webhook so payment status updates in Supabase dashboard
2. Set up real Payaza account at payaza.africa and complete KYC
3. UI/UX overhaul

---

## Notes for Claude
- The builder is a Nigerian engineering student
- We are building together as a team — be direct, practical, and specific
- Always suggest code changes that can be pushed to GitHub and auto-deploy on Vercel
- Payaza docs: https://docs.payaza.africa
- When suggesting UI changes, think OPay / Paystack quality fintech design