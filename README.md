[![Black Friday Deal Finder 2026](https://make.fun/badge/black-friday-deal-finder-01.svg)](https://make.fun/competitions/black-friday-deal-finder-01)
[![Rank](https://make.fun/badge/black-friday-deal-finder-01/Xyzar29/black-friday-deal-finder/rank.svg)](https://make.fun/competitions/black-friday-deal-finder-01)
[![Reward](https://make.fun/badge/black-friday-deal-finder-01/Xyzar29/black-friday-deal-finder/reward.svg)](https://make.fun/competitions/black-friday-deal-finder-01)

# DealHound — Black Friday 2026 Deal Finder

A real Black Friday deal finder: **33 deals** across TVs, laptops, audio & wearables, gaming & toys, kitchen, home & cleaning, and smart home, at Amazon, Best Buy, Walmart, and Costco.

Every price was read from the named store or from a deals source that names the store on **Black Friday itself, 27 November 2026**. Each deal shows its product, store, sale price, usual price, discount, deal window, the source that showed the price, and the day it was checked — plus an honest verdict:

- **New low** — a source calls it the lowest / record price for that product
- **Strong deal** — 40% or more off
- **Fair deal** — 20–39% off
- **Routine sale** — under 20% off (listed too, so you can see what is not worth rushing for)

Search, category, store, minimum-discount and verdict filters all work, as does sorting (best deal, biggest % discount, biggest $ saving, price). Clicking a deal opens its details; the store link opens that store's search for the exact product name, so the matching listing is the first result. The current search, filters and open deal live in the URL hash, so any view is shareable.

## Run it locally

```sh
node serve.ts            # http://localhost:8080
```

## Hand it in

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the kit's `buildDossier`:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Entry

Built for [black-friday-deal-finder-01](https://make.fun/competitions/black-friday-deal-finder-01) on make.fun.
