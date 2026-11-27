// filters.js — search, filter and sort for the deal list.
// Pure functions over the deal array in data.js; no DOM here.

import { discountPct, savedAmount } from "./data.js";

export function applyFilters(deals, state) {
  const query = state.query.trim().toLowerCase();
  return deals.filter((deal) => {
    if (state.category !== "All" && deal.category !== state.category) return false;
    if (state.store !== "All" && deal.store !== state.store) return false;
    if (state.minDiscount > 0 && discountPct(deal) < state.minDiscount) return false;
    if (state.verdict !== "All" && deal.verdict !== state.verdict) return false;
    if (query) {
      const haystack = `${deal.product} ${deal.store} ${deal.category}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });
}

const SORTERS = {
  "best-deal": (a, b) => {
    const rank = { "NEW LOW": 0, STRONG: 1, FAIR: 2, ROUTINE: 3 };
    return rank[a.verdict] - rank[b.verdict] || discountPct(b) - discountPct(a);
  },
  "biggest-discount": (a, b) => discountPct(b) - discountPct(a),
  "biggest-saving": (a, b) => savedAmount(b) - savedAmount(a),
  "price-low": (a, b) => a.sale - b.sale,
  "price-high": (a, b) => b.sale - a.sale,
};

export function sortDeals(deals, sortKey) {
  const sorter = SORTERS[sortKey] || SORTERS["best-deal"];
  return [...deals].sort(sorter);
}

export function summarize(deals) {
  if (deals.length === 0) {
    return { count: 0, avgDiscount: 0, bestDiscount: 0, totalSaved: 0 };
  }
  const pcts = deals.map(discountPct);
  const totalSaved = deals.reduce((sum, deal) => sum + savedAmount(deal), 0);
  return {
    count: deals.length,
    avgDiscount: Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length),
    bestDiscount: Math.max(...pcts),
    totalSaved: Math.round(totalSaved),
  };
}
