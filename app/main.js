// main.js — boots DealHound: wires the controls, renders the grid,
// and keeps the current search / filters / open deal in the URL hash
// so any view (including a filtered one) is a shareable link.

import { CATEGORIES, CHECKED_NOTE, DEALS, STORES } from "./data.js";
import { applyFilters, sortDeals, summarize } from "./filters.js";
import { dealCard, dealDetail, emptyState } from "./views.js";

const grid = document.getElementById("deal-grid");
const countLine = document.getElementById("result-count");
const statsLine = document.getElementById("stats-line");
const searchInput = document.getElementById("search");
const categorySelect = document.getElementById("category");
const storeSelect = document.getElementById("store");
const discountSelect = document.getElementById("discount");
const verdictSelect = document.getElementById("verdict");
const sortSelect = document.getElementById("sort");
const modal = document.getElementById("modal");
const modalBox = document.getElementById("modal-box");

const state = {
  query: "",
  category: "All",
  store: "All",
  minDiscount: 0,
  verdict: "All",
  sort: "best-deal",
};

function fillSelect(select, options) {
  for (const option of options) {
    const el = document.createElement("option");
    el.value = option;
    el.textContent = option;
    select.appendChild(el);
  }
}

function readHash() {
  const hash = new URLSearchParams(location.hash.slice(1));
  if (hash.get("q")) state.query = hash.get("q");
  if (hash.get("cat") && (hash.get("cat") === "All" || CATEGORIES.includes(hash.get("cat")))) {
    state.category = hash.get("cat");
  }
  if (hash.get("store") && (hash.get("store") === "All" || STORES.includes(hash.get("store")))) {
    state.store = hash.get("store");
  }
  if (hash.get("min")) state.minDiscount = Number(hash.get("min")) || 0;
  if (hash.get("verdict") && ["All", "NEW LOW", "STRONG", "FAIR", "ROUTINE"].includes(hash.get("verdict"))) {
    state.verdict = hash.get("verdict");
  }
  if (hash.get("sort")) state.sort = hash.get("sort");
  return hash.get("deal");
}

function writeHash(openDealId) {
  const hash = new URLSearchParams();
  if (state.query) hash.set("q", state.query);
  if (state.category !== "All") hash.set("cat", state.category);
  if (state.store !== "All") hash.set("store", state.store);
  if (state.minDiscount) hash.set("min", String(state.minDiscount));
  if (state.verdict !== "All") hash.set("verdict", state.verdict);
  if (state.sort !== "best-deal") hash.set("sort", state.sort);
  if (openDealId) hash.set("deal", openDealId);
  const next = hash.toString();
  history.replaceState(null, "", next ? "#" + next : location.pathname + location.search);
}

function render() {
  const filtered = sortDeals(applyFilters(DEALS, state), state.sort);
  grid.innerHTML = filtered.length ? filtered.map(dealCard).join("") : emptyState();
  const summary = summarize(filtered);
  countLine.textContent =
    filtered.length === DEALS.length
      ? `Showing all ${DEALS.length} deals`
      : `Showing ${filtered.length} of ${DEALS.length} deals`;
  statsLine.textContent =
    `Average discount ${summary.avgDiscount}% · Best discount ${summary.bestDiscount}% off · ` +
    `Total savings on this page $${summary.totalSaved.toLocaleString("en-US")}`;
}

function openDeal(id) {
  const deal = DEALS.find((d) => d.id === id);
  if (!deal) return;
  modalBox.innerHTML = dealDetail(deal);
  modal.hidden = false;
  document.body.classList.add("modal-open");
  writeHash(id);
}

function closeDeal() {
  modal.hidden = true;
  modalBox.innerHTML = "";
  document.body.classList.remove("modal-open");
  writeHash(null);
}

function syncControls() {
  searchInput.value = state.query;
  categorySelect.value = state.category;
  storeSelect.value = state.store;
  discountSelect.value = String(state.minDiscount);
  verdictSelect.value = state.verdict;
  sortSelect.value = state.sort;
}

function bind() {
  searchInput.addEventListener("input", () => {
    state.query = searchInput.value;
    writeHash(null);
    render();
  });
  categorySelect.addEventListener("change", () => {
    state.category = categorySelect.value;
    writeHash(null);
    render();
  });
  storeSelect.addEventListener("change", () => {
    state.store = storeSelect.value;
    writeHash(null);
    render();
  });
  discountSelect.addEventListener("change", () => {
    state.minDiscount = Number(discountSelect.value);
    writeHash(null);
    render();
  });
  verdictSelect.addEventListener("change", () => {
    state.verdict = verdictSelect.value;
    writeHash(null);
    render();
  });
  sortSelect.addEventListener("change", () => {
    state.sort = sortSelect.value;
    writeHash(null);
    render();
  });
  grid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-deal]");
    if (button) openDeal(button.dataset.deal);
  });
  modal.addEventListener("click", (event) => {
    if (event.target === modal || event.target.closest("[data-close]")) closeDeal();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) closeDeal();
  });
  window.addEventListener("hashchange", () => {
    const openDealId = readHash();
    syncControls();
    render();
    if (openDealId) openDeal(openDealId);
  });
}

fillSelect(categorySelect, ["All", ...CATEGORIES]);
fillSelect(storeSelect, ["All", ...STORES]);
document.getElementById("checked-note").textContent = CHECKED_NOTE;
const openDealId = readHash();
syncControls();
bind();
render();
if (openDealId) openDeal(openDealId);
