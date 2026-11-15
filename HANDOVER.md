# Handover: Uveitis Workup tool

For whichever Claude session (or person) continues this work. Last updated 2026-11-15.

## What this is
- Owner: Dr Ikhlas Mahmoud, NHS ophthalmologist (RVI Newcastle). Android phone and tablet, Windows PC. No Apple devices.
- A front-of-patient uveitis clinic tool. Live at https://iklass-m.github.io/uveitis/
- Hard rules: plain HTML/JS/CSS in one `index.html`, no build step, no API calls, no paid services, works offline, English only, no patient data leaves the device, nothing identifying is ever entered. Cream background, navy and rust accents, serif headings.
- GitHub Pages deploys from `main` (root) automatically. `sw.js` is network-first for the page, so installed devices update when online. Bump `CACHE` in `sw.js` on each change.
- The owner is not a developer. She has asked Claude to merge PRs itself ("U do it"). Explain in plain language; flag anything clinical that is not verified.
- An old copy lives on her laptop at `D:\ebooks\uveitis-tool\`. It is out of date. Always pull from GitHub first.

## What is built (all on main)
- Tabs: Quick DDx, History, Review of systems, Eye signs, Imaging, Investigations, Results, Summary.
- One weighted differential (`computeEvidence` in `index.html`): typed findings (`QRULES`, `QABBR`, `QAGAINST`), Yes answers, tapped signs (`EYE`, `IMG`), lab interpreter (`interpret`). Weights: `specW`, `DXPRIOR` (judgement, not data).
- Imaging tab: tappable findings plus per-condition cards (`IMGATLAS`) with "what to look for", signature, pearl, links.
- Autosave of the current case on the device (`SAVE_KEY`), tablet layout, compact phone header.
- Clinical read-through done (PR #7). See "Open clinical points" below.

## Tests (run before every merge)
```
python3 -m http.server 8765 &        # from the repo root
node tests/quick-cases.js tests/cases-clinic.json      # expect 20 lines starting OK
node tests/quick-cases.js tests/cases-shorthand.json   # expect 8 lines starting OK
node tests/click-all.js                                # expect "clicked 330 ERRS []" (count may grow)
node tests/unified.js /tmp                             # typed+tapped, restore, widths 375/800/1280
```
Playwright and Chromium are preinstalled in Claude cloud sessions. Also check `document.documentElement.scrollWidth` equals the viewport at 375 px on any new tab.

## In progress when this was written
An external review of PR #7 was pasted by the owner. Apply these to `index.html`:
1. **MS in intermediate uveitis**: currently "roughly 10–20%" (3 places: ROS neuro item, MRI monograph, panel builder). Change to "about 1–5% overall; higher (up to ~16–20%) in long-term pars planitis cohorts at referral centres". Sources: Maghsoudlou et al, JAMA 2025;334:419; Abraham et al, Neurol Neuroimmunol Neuroinflamm 2021.
2. **Methotrexate, men**: reword to "paternal low-dose methotrexate (<25 mg/week) is compatible with conception (BSR; ACR 2020 conditionally agrees)". Add that the product licence and AAD-NPF still advise waiting 3 months, so guidance disagrees.
3. **Methotrexate, women**: UNRESOLVED. The tool says stop 3 months before (and attributes it to BSR). The review says BSR is one of two guidelines giving "at least 1 month". A web search here found only the 3-month figure in secondary summaries. Safe wording until someone reads the BSR 2022 text (doi 10.1093/rheumatology/keac551): "stop before conception: most guidelines say 3 months, some say at least 1 month; follow rheumatology/obstetric advice".
4. **sIL-2R**: add that Groen-Hakan 2017 used a ≥4000 pg/mL cut-off in confirmed sarcoid (AUC 0.76 vs 0.65 for ACE, P=.06), Gundlach 2016 used a lower cut-off and included probable/possible cases, and sIL-2R is also raised in HLA-B27 and VZV uveitis.
5. **Ocular syphilis LP**: add that a cranial nerve examination is required; cranial nerve dysfunction means CSF is needed; CSF "may help" when there are symptoms but no findings. BASHH 2024 agrees CSF is rarely useful in ophthalmic syphilis.
6. **BASHH 2024 doses** (replace "2015" wording; Kingston et al, Int J STD AIDS 2024;35:1142): first line procaine penicillin 1.8–2.4 MU IM daily + probenecid 500 mg QDS 14 days, or benzylpenicillin 1.8–2.4 g IV 4-hourly 14 days. Alternatives: ceftriaxone 2 g IM/IV 10–14 days; doxycycline 200 mg BD 28 days; amoxicillin 2 g TDS + probenecid 500 mg QDS 28 days. Prednisolone 40–60 mg daily for 3 days starting 24 h before. Restart the course if interrupted >24 h. Probenecid: avoid with sulfa allergy.
7. **IWOS list**: the review confirms calcium is not an IWOS investigation and says sIL-2R is explicitly excluded. Its list omits lysozyme; the tool says lysozyme is on the list. UNRESOLVED: check Mochizuki, BJO 2019;103:1418 and correct the tool if lysozyme is not listed.
8. Negative toxoplasma IgG: already down-ranks rather than excludes. Keep, and keep the immunocompetent/immunosuppressed distinction.

## Still to build (owner said yes)
A. **Treatment & monitoring tab** (`7 · Treatment`). Suggested sections, each with a source line and "check BNF / local protocol":
   - Before treating: exclude infection and masquerade; syphilis/TB screen; sample first if it matters.
   - Steroid ladder: topical, periocular/intravitreal (Ozurdex; NICE TA460), oral prednisolone (1 mg/kg, max 60–80 mg, taper), IV methylprednisolone. Target ≤7.5 mg/day by 3 months, otherwise add a steroid-sparing agent. Bone, gastric, BP, glucose, IOP, cataract monitoring.
   - Steroid-sparing agents: methotrexate, mycophenolate, azathioprine (TPMT first), ciclosporin, tacrolimus; adalimumab (NICE TA460 criteria; VISUAL dosing), infliximab. For each: dose, baseline tests, monitoring (BSR 2017 DMARD monitoring guideline), key cautions, pregnancy.
   - Pre-biologic screen: TB (IGRA + CXR), hepatitis B/C, HIV, VZV status, MRI brain if demyelination risk, vaccines.
   - Infection regimens: ARN, toxoplasma, CMV, syphilis (BASHH 2024 above), TB (refer TB service), endophthalmitis intravitreal doses.
   - Her Notion pages "imt / imd combined" and "uveitis" and "Practical from telegram" have her own notes on these. Use them first, then verify.
   - Every dose must be verified against a primary source before it goes live, and anything unverified must be labelled.
B. **SUN grading**: AC cells, flare, vitreous haze (NEI/Nussenblatt) as selects on the Eye signs tab, plus SUN onset/duration/course and activity terms. Feed into the Summary. Source: Jabs et al, Am J Ophthalmol 2005;140:509.
C. **SUN 2021 classification criteria** checklists for the main entities (not started).
D. Add references to each Imaging card (PubMed connector was failing to connect; retry).
E. Optional: her Notion pearls into matching cards; "save several cases on the device".

## Known limits to tell the owner about
- Quick DDx is keyword matching, not AI. It shows a "Not recognised" list.
- Weights and prevalence scaling are judgement. Adjust on feedback.
- Figures quoted from her textbooks (Joye & Gonzales, Foster, Wills, the Handbook) were only checked for plausibility.
- This cloud environment cannot open PMC, EyeWiki or the live site directly; WebSearch works.
