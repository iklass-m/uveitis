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
- Tabs: Quick DDx, History, Review of systems, Eye signs, Imaging, Investigations, Results, Treatment, SUN criteria, Summary.
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

## Review corrections (applied 2026-11-15)
The external review of PR #7 has been applied: MS figure (1–5% overall), methotrexate wording for men and women, sIL-2R context, cranial nerve examination and LP conditions in ocular syphilis, BASHH 2024 regimens.

Both previously unresolved points are now settled (2026-11-15, second pass):
- **Methotrexate washout for women.** BSR 2022 itself: stop at least 1 month before planned conception, switch to a pregnancy-compatible drug, folic acid 5 mg daily to 12 weeks if exposed in that month. The tool says this and notes the licence says longer.
- **Lysozyme in IWOS 2019.** Confirmed: elevated serum lysozyme is item 4 of the 8 systemic investigations in Mochizuki, BJO 2019;103:1418 (table reproduced in PMC10507006). No change needed.

## Still to build (owner said yes)
A. **Treatment & monitoring tab**: FIRST VERSION DONE (2026-11-15). `TX` in `index.html`, 18 cards, tab `7 · Treatment`. Content came from her Notion "imt / imd combined" notes plus UK guidance. Still to do on it:
   - VERIFIED (2026-11-15) and labels removed: NICE TA460 criteria and stop rule (quoted from nice.org.uk); BSR 2025 csDMARD monitoring (keaf522: week 2, monthly to 3-6 months, then 3-monthly; CNIs fortnightly to stable 6 weeks; Table 5 actions); BSR 2022 pregnancy statements; MHRA Feb 2018 mycophenolate advice for men; tacrolimus (Luis 2021 Moorfields: median 3 mg/day, trough 5-10 ng/mL); CMV (DHHS/EACS); intravitreal antimicrobials (Relhan, Retina 2017 table: ceftazidime 2.25 mg, voriconazole 50-100 micrograms); prednisolone ceiling and flare rule (Jabs 2000). The taper steps are labelled as an example, since no guideline fixes them.
   - Not yet covered: uveitic macular oedema pathway, cataract/glaucoma surgery in uveitis, JIA uveitis pathway, vaccination advice on immunosuppression. Her "Practical from telegram" Notion page has material on pre-phaco management.
B. **SUN grading**: DONE (2026-11-15). Selects on the Eye signs tab (`SUN`, `SUNKEY`, `sunVal`), saved with the case and written to the Summary.
C. **SUN 2021 classification criteria**: DONE (2026-11-15). Tab `✓ SUN criteria` (`CRI` findings, `SUNC` 26 entities incl. VKH early and late, `critSel`, `renderCrit`, `cStatus`). Transcribed from the criteria table of each SUN paper (PMC full text, Am J Ophthalmol 2021;228). A finding ticked once counts for every entity; rule nodes all/any/min/not; exclusions with the SUN "unless" exceptions (retinitis co-infection PCR, toxo seronegative, sarcoid vs TB biopsy). Saved with the case (`crit`), cleared by New patient, met entities written to the Summary. Not linked to the weighted differential (deliberately: classification, not diagnosis).
D. Add references to each Imaging card (PubMed connector was failing to connect; retry).
E. Optional: her Notion pearls into matching cards; "save several cases on the device".

## Known limits to tell the owner about
- Quick DDx is keyword matching, not AI. It shows a "Not recognised" list.
- Weights and prevalence scaling are judgement. Adjust on feedback.
- Figures quoted from her textbooks (Joye & Gonzales, Foster, Wills, the Handbook) were only checked for plausibility.
- This cloud environment cannot open PMC, EyeWiki or the live site directly; WebSearch works.
