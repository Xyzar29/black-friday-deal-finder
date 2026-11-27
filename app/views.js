// views.js — turns deals into HTML. One job: rendering only.
// All money is formatted here; all verdict wording lives here too.

import { CHECKED_DAY, discountPct, savedAmount } from "./data.js";

const VERDICT_LABEL = {
  "NEW LOW": "New low",
  STRONG: "Strong deal",
  FAIR: "Fair deal",
  ROUTINE: "Routine sale",
};

export function money(amount) {
  return "$" + amount.toFixed(2).replace(/\.00$/, "");
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function dealCard(deal) {
  const pct = discountPct(deal);
  const saved = savedAmount(deal);
  return `
<article class="card" data-id="${deal.id}">
  <div class="card-top">
    <span class="store-chip">${escapeHtml(deal.store)}</span>
    <span class="verdict verdict-${deal.verdict.toLowerCase().replace(" ", "-")}">${VERDICT_LABEL[deal.verdict]}</span>
  </div>
  <h3 class="card-title">${escapeHtml(deal.product)}</h3>
  <p class="card-category">${escapeHtml(deal.category)} &middot; ${escapeHtml(deal.window)}</p>
  <div class="price-row">
    <span class="sale-price">${money(deal.sale)}</span>
    <span class="usual-price">${money(deal.usual)}</span>
    <span class="discount-badge">−${pct}%</span>
  </div>
  <p class="save-line">You save ${money(saved)}</p>
  <p class="verdict-note">${escapeHtml(deal.verdictNote)}</p>
  <div class="card-foot">
    <a class="deal-link" href="${escapeHtml(deal.link)}" target="_blank" rel="noopener">View at ${escapeHtml(deal.store)} &rarr;</a>
    <button class="detail-btn" type="button" data-deal="${deal.id}">Details</button>
  </div>
  <p class="checked-line">Checked ${CHECKED_DAY} &middot; ${escapeHtml(deal.source)}</p>
</article>`;
}

export function dealDetail(deal) {
  const pct = discountPct(deal);
  const saved = savedAmount(deal);
  return `
<div class="detail" role="dialog" aria-label="Deal details">
  <button class="detail-close" type="button" data-close="1" aria-label="Close">&times;</button>
  <span class="store-chip">${escapeHtml(deal.store)}</span>
  <span class="verdict verdict-${deal.verdict.toLowerCase().replace(" ", "-")}">${VERDICT_LABEL[deal.verdict]}</span>
  <h2>${escapeHtml(deal.product)}</h2>
  <p class="detail-category">${escapeHtml(deal.category)} &middot; ${escapeHtml(deal.window)}</p>
  <div class="detail-prices">
    <div><span class="detail-label">Sale price</span><span class="detail-sale">${money(deal.sale)}</span></div>
    <div><span class="detail-label">Usual price</span><span class="detail-usual">${money(deal.usual)}</span></div>
    <div><span class="detail-label">Discount</span><span class="detail-discount">−${pct}% (${money(saved)} off)</span></div>
  </div>
  <p class="detail-note">${escapeHtml(deal.verdictNote)}</p>
  <p class="detail-source"><strong>Where the price was read:</strong> ${escapeHtml(deal.source)}. Checked ${CHECKED_DAY}.</p>
  <a class="deal-link detail-cta" href="${escapeHtml(deal.link)}" target="_blank" rel="noopener">View this product at ${escapeHtml(deal.store)} &rarr;</a>
  <p class="detail-hint">The link opens ${escapeHtml(deal.store)}'s search for this exact product name, so the matching listing is the first result.</p>
</div>`;
}

export function emptyState() {
  return `<p class="empty">No deals match those filters. Try clearing the search or lowering the minimum discount.</p>`;
}
