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

## Review corrections (applied 2026-11-15)
The external review of PR #7 has been applied: MS figure (1–5% overall), methotrexate wording for men and women, sIL-2R context, cranial nerve examination and LP conditions in ocular syphilis, BASHH 2024 regimens.

Two points are still UNRESOLVED and need the primary source:
- **Methotrexate washout for women.** The tool now says "most guidelines 3 months, some at least 1 month, licences up to 6". Read BSR 2022 (doi 10.1093/rheumatology/keac551) and state what BSR itself says.
- **Lysozyme in IWOS 2019.** The tool lists lysozyme as an IWOS investigation; the review's list omits it. Check Mochizuki, BJO 2019;103:1418 and correct if needed.

## Still to build (owner said yes)
A. **Treatment & monitoring tab**: FIRST VERSION DONE (2026-11-15). `TX` in `index.html`, 18 cards, tab `7 · Treatment`. Content came from her Notion "imt / imd combined" notes plus UK guidance. Still to do on it:
   - Verify against primary sources and remove the "not re-verified" labels: tacrolimus dose; CMV regimen; intravitreal doses (foscarnet, ganciclovir, clindamycin, vancomycin, ceftazidime, antifungals); NICE TA460 full criteria and stopping rules (nice.org.uk/guidance/ta460/chapter/1-recommendations); BSR DMARD monitoring 2025 update (the tab quotes the 2017 schedule); the prednisolone taper; MHRA advice on mycophenolate in men.
   - Not yet covered: uveitic macular oedema pathway, cataract/glaucoma surgery in uveitis, JIA uveitis pathway, vaccination advice on immunosuppression. Her "Practical from telegram" Notion page has material on pre-phaco management.
B. **SUN grading**: DONE (2026-11-15). Selects on the Eye signs tab (`SUN`, `SUNKEY`, `sunVal`), saved with the case and written to the Summary.
C. **SUN 2021 classification criteria** checklists for the main entities (not started).
D. Add references to each Imaging card (PubMed connector was failing to connect; retry).
E. Optional: her Notion pearls into matching cards; "save several cases on the device".

## Known limits to tell the owner about
- Quick DDx is keyword matching, not AI. It shows a "Not recognised" list.
- Weights and prevalence scaling are judgement. Adjust on feedback.
- Figures quoted from her textbooks (Joye & Gonzales, Foster, Wills, the Handbook) were only checked for plausibility.
- This cloud environment cannot open PMC, EyeWiki or the live site directly; WebSearch works.
