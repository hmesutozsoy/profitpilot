import { useState, useRef, useEffect, useMemo } from "react";


const LOGO_URL = "/logo.png";
// ─── Historical Sales Data (12 months) ────────────────────────────────────
const MONTHS = ["Apr'25","May'25","Jun'25","Jul'25","Aug'25","Sep'25","Oct'25","Nov'25","Dec'25","Jan'26","Feb'26","Mar'26"];
const CURRENT_MONTH_IDX = 11; // Mar'26

const PRODUCTS = [
  {
    id: 1, name: "Running Sneakers Pro", emoji: "👟", category: "Footwear",
    sellPrice: 119.99, costPrice: 42.00, shippingCost: 8.50, adSpend: 15.00, platformFee: 0.029,
    stock: 15,
    monthlySales: [22, 28, 35, 40, 38, 30, 25, 45, 60, 35, 32, 47],
    competitors: [
      { name: "Nike Pegasus 41", price: 129.99, store: "Nike.com" },
      { name: "Adidas Ultraboost", price: 189.99, store: "Adidas.com" },
      { name: "New Balance Fresh Foam", price: 109.99, store: "Amazon" },
    ],
    costDrivers: ["rubber", "petroleum", "logistics"],
  },
  {
    id: 2, name: "Skeleton Glow Costume Set", emoji: "💀", category: "Costumes",
    sellPrice: 49.99, costPrice: 15.00, shippingCost: 6.00, adSpend: 10.00, platformFee: 0.029,
    stock: 350,
    monthlySales: [15, 10, 12, 28, 65, 180, 420, 680, 40, 18, 12, 20],
    competitors: [
      { name: "Spirit Halloween Skeleton", price: 39.99, store: "SpiritHalloween" },
      { name: "Morphsuits Glow Skeleton", price: 44.99, store: "Amazon" },
      { name: "Smiffys UV Skeleton Suit", price: 32.99, store: "Walmart" },
    ],
    costDrivers: ["plastics", "dyes", "labor_asia"],
  },
  {
    id: 3, name: "Organic Cotton T-Shirt", emoji: "👕", category: "Apparel",
    sellPrice: 28.00, costPrice: 14.50, shippingCost: 3.50, adSpend: 8.00, platformFee: 0.029,
    stock: 200,
    monthlySales: [40, 55, 80, 95, 90, 60, 45, 50, 65, 40, 50, 85],
    competitors: [
      { name: "Uniqlo Supima Tee", price: 19.90, store: "Uniqlo" },
      { name: "Everlane Organic Crew", price: 30.00, store: "Everlane" },
      { name: "Patagonia Organic Tee", price: 45.00, store: "Patagonia" },
    ],
    costDrivers: ["cotton", "dyes", "labor_asia"],
  },
  {
    id: 4, name: "Smart Water Bottle", emoji: "🍶", category: "Lifestyle",
    sellPrice: 45.00, costPrice: 22.00, shippingCost: 6.00, adSpend: 18.00, platformFee: 0.029,
    stock: 60,
    monthlySales: [15, 18, 22, 25, 20, 14, 10, 18, 30, 12, 10, 12],
    competitors: [
      { name: "HidrateSpark PRO", price: 69.99, store: "Amazon" },
      { name: "LARQ Bottle PureVis", price: 58.00, store: "LARQ.com" },
      { name: "Thermos Smart Lid", price: 29.99, store: "Target" },
    ],
    costDrivers: ["stainless_steel", "electronics", "logistics"],
  },
  {
    id: 5, name: "Bamboo Desk Organizer", emoji: "🗂️", category: "Office",
    sellPrice: 22.50, costPrice: 11.00, shippingCost: 4.50, adSpend: 10.00, platformFee: 0.029,
    stock: 80,
    monthlySales: [10, 8, 6, 5, 8, 15, 12, 20, 25, 18, 12, 15],
    competitors: [
      { name: "IKEA KVISSLE", price: 14.99, store: "IKEA" },
      { name: "SimpleHouseware Organizer", price: 12.99, store: "Amazon" },
      { name: "Grovemade Desk Shelf", price: 180.00, store: "Grovemade" },
    ],
    costDrivers: ["bamboo", "labor_asia", "logistics"],
  },
  {
    id: 6, name: "Mechanical Keyboard", emoji: "⌨️", category: "Electronics",
    sellPrice: 89.99, costPrice: 35.00, shippingCost: 7.00, adSpend: 14.00, platformFee: 0.029,
    stock: 25,
    monthlySales: [12, 15, 14, 12, 10, 18, 22, 40, 55, 25, 20, 30],
    competitors: [
      { name: "Keychron K6", price: 74.99, store: "Keychron" },
      { name: "Royal Kludge RK84", price: 59.99, store: "Amazon" },
      { name: "Logitech MX Mechanical", price: 149.99, store: "Logitech" },
    ],
    costDrivers: ["semiconductors", "plastics", "logistics"],
  },
  {
    id: 7, name: "Aromatherapy Candle Set", emoji: "🕯️", category: "Home",
    sellPrice: 38.00, costPrice: 12.00, shippingCost: 5.50, adSpend: 20.00, platformFee: 0.029,
    stock: 90,
    monthlySales: [10, 8, 6, 5, 8, 12, 18, 45, 65, 15, 12, 22],
    competitors: [
      { name: "Yankee Candle Set", price: 34.99, store: "Amazon" },
      { name: "Boy Smells Trio", price: 96.00, store: "Nordstrom" },
      { name: "Bath & Body Works 3-Wick", price: 26.50, store: "BBW" },
    ],
    costDrivers: ["soy_wax", "fragrance_oils", "glass"],
  },
  {
    id: 8, name: "UV Protection Sunglasses", emoji: "🕶️", category: "Accessories",
    sellPrice: 55.00, costPrice: 8.00, shippingCost: 3.00, adSpend: 6.00, platformFee: 0.029,
    stock: 70,
    monthlySales: [25, 40, 55, 65, 60, 35, 20, 15, 18, 15, 22, 40],
    competitors: [
      { name: "Goodr OG Sunglasses", price: 25.00, store: "Goodr.com" },
      { name: "Ray-Ban Wayfarer", price: 163.00, store: "Ray-Ban" },
      { name: "Knockaround Premiums", price: 30.00, store: "Amazon" },
    ],
    costDrivers: ["plastics", "petroleum", "logistics"],
  },
];

// ─── Holiday & Seasonal Calendar ──────────────────────────────────────────
const SEASONAL_EVENTS = [
  { month: 0, name: "Ramadan / Easter", categories: ["Home", "Lifestyle"], multiplier: 1.2 },
  { month: 1, name: "Mother's Day", categories: ["Accessories", "Home"], multiplier: 1.35 },
  { month: 2, name: "Summer Kickoff", categories: ["Footwear", "Accessories", "Apparel"], multiplier: 1.4 },
  { month: 3, name: "Mid-Year Sale", categories: ["all"], multiplier: 1.25 },
  { month: 4, name: "Back to School", categories: ["Electronics", "Office", "Apparel"], multiplier: 1.3 },
  { month: 5, name: "Fall Season / Halloween Prep", categories: ["Apparel", "Home", "Costumes"], multiplier: 1.8 },
  { month: 6, name: "Halloween / Pre-Holiday", categories: ["Home", "Lifestyle", "Costumes"], multiplier: 2.5 },
  { month: 7, name: "Black Friday / Cyber Monday", categories: ["all"], multiplier: 1.8 },
  { month: 8, name: "Christmas / Holiday", categories: ["all"], multiplier: 2.0 },
  { month: 9, name: "New Year / Clearance", categories: ["all"], multiplier: 1.15 },
  { month: 10, name: "Valentine's Day", categories: ["Accessories", "Home"], multiplier: 1.25 },
  { month: 11, name: "Spring Collection", categories: ["Apparel", "Footwear"], multiplier: 1.2 },
];

// ─── Real-World Cost Drivers ──────────────────────────────────────────────
const COST_DRIVERS = {
  petroleum: { name: "Oil & Petroleum", trend: "rising", change: "+8%", forecast6m: "+12-18%", reason: "OPEC+ production cuts extended, Middle East tensions, shipping fuel surcharges increasing" },
  rubber: { name: "Natural Rubber", trend: "rising", change: "+5%", forecast6m: "+8-14%", reason: "Thailand/Indonesia supply disruption from flooding, increased EV tire demand" },
  cotton: { name: "Cotton Futures", trend: "rising", change: "+12%", forecast6m: "+15-22%", reason: "Drought in India and US, cotton futures at 18-month high, tariff uncertainty" },
  semiconductors: { name: "Semiconductors", trend: "stable", change: "+2%", forecast6m: "+3-6%", reason: "TSMC capacity expansion balancing AI chip demand, consumer electronics softening" },
  lithium: { name: "Lithium", trend: "declining", change: "-15%", forecast6m: "-5 to +5%", reason: "Oversupply from Australian mines, but EV demand floor expected by Q3" },
  logistics: { name: "Shipping & Logistics", trend: "rising", change: "+10%", forecast6m: "+15-25%", reason: "Red Sea rerouting continues, container rates up 40% YoY on Asia-US lanes, port congestion" },
  labor_asia: { name: "Asian Labor Costs", trend: "rising", change: "+6%", forecast6m: "+8-12%", reason: "Vietnam/Bangladesh minimum wage increases, China labor shortage in manufacturing hubs" },
  stainless_steel: { name: "Stainless Steel", trend: "stable", change: "+3%", forecast6m: "+4-8%", reason: "China steel output controls, nickel prices stabilizing after volatility" },
  soy_wax: { name: "Soy Wax", trend: "rising", change: "+7%", forecast6m: "+10-15%", reason: "Soybean prices rising from US export demand, biofuel competition for soy oil" },
  fragrance_oils: { name: "Fragrance Oils", trend: "stable", change: "+2%", forecast6m: "+3-5%", reason: "Synthetic fragrance supply stable, natural essential oils seeing moderate increases" },
  glass: { name: "Glass & Containers", trend: "rising", change: "+4%", forecast6m: "+6-10%", reason: "Energy costs driving furnace operation costs up, soda ash prices elevated" },
  bamboo: { name: "Bamboo", trend: "stable", change: "+1%", forecast6m: "+2-4%", reason: "Abundant supply, minimal price pressure, slight logistics cost passthrough" },
  dyes: { name: "Textile Dyes", trend: "rising", change: "+9%", forecast6m: "+12-18%", reason: "EU REACH chemical regulations tightening, Chinese dye factory closures for environmental compliance" },
  plastics: { name: "Plastics & Polymers", trend: "rising", change: "+6%", forecast6m: "+8-14%", reason: "Petroleum feedstock costs rising, recycled plastic mandates increasing production costs" },
  electronics: { name: "Consumer Electronics Components", trend: "stable", change: "+3%", forecast6m: "+4-7%", reason: "Capacitor and PCB supply adequate, slight pressure from tariff uncertainty" },
};

// ─── Forecast Engine ──────────────────────────────────────────────────────
function forecastSales(product, monthsAhead = 6) {
  const sales = product.monthlySales;
  const n = sales.length;

  // Average monthly sales across the full year
  const avgMonthly = sales.reduce((a, b) => a + b, 0) / n;

  // Seasonal index: how each month compares to the average
  const seasonalIdx = sales.map(s => avgMonthly > 0 ? s / avgMonthly : 1);

  // Year-over-year growth factor (compare last 6mo total vs first 6mo total)
  const firstHalf = sales.slice(0, 6).reduce((a, b) => a + b, 0);
  const secondHalf = sales.slice(6).reduce((a, b) => a + b, 0);
  const growthFactor = firstHalf > 0 ? Math.min(1.5, Math.max(0.7, secondHalf / firstHalf)) : 1;

  const forecast = [];
  for (let i = 1; i <= monthsAhead; i++) {
    const monthIdx = (CURRENT_MONTH_IDX + i) % 12;

    // Base prediction from seasonal pattern
    const seasonalValue = avgMonthly * seasonalIdx[monthIdx] * growthFactor;

    // Holiday multiplier
    const event = SEASONAL_EVENTS[monthIdx];
    let holidayMult = 1;
    let eventName = null;
    if (event && (event.categories.includes("all") || event.categories.includes(product.category))) {
      holidayMult = event.multiplier;
      eventName = event.name;
    }

    const predicted = Math.max(1, Math.round(seasonalValue * holidayMult));
    const futureMonthNames = ["Apr'26","May'26","Jun'26","Jul'26","Aug'26","Sep'26"];
    forecast.push({
      month: futureMonthNames[i - 1] || `+${i}m`,
      predicted,
      event: eventName,
      holidayMult,
      monthIdx,
    });
  }
  return forecast;
}

function predictStockout(product) {
  const forecast = forecastSales(product, 6);
  let remaining = product.stock;
  let stockoutMonth = null;
  let stockoutDay = null;

  for (let i = 0; i < forecast.length; i++) {
    const dailyRate = forecast[i].predicted / 30;
    if (remaining <= 0) { stockoutMonth = i; stockoutDay = 0; break; }
    const daysThisMonth = remaining / dailyRate;
    if (daysThisMonth < 30) {
      stockoutMonth = i;
      stockoutDay = Math.round(daysThisMonth);
      break;
    }
    remaining -= forecast[i].predicted;
  }

  const totalDays = stockoutMonth !== null
    ? stockoutMonth * 30 + (stockoutDay || 0)
    : 999;

  return { totalDays, stockoutMonth, stockoutDay, forecast };
}

function calcProfit(p) {
  const txFee = p.sellPrice * p.platformFee + 0.30;
  const totalCost = p.costPrice + p.shippingCost + p.adSpend + txFee;
  const profit = p.sellPrice - totalCost;
  const margin = (profit / p.sellPrice) * 100;
  return { profit: +profit.toFixed(2), margin: +margin.toFixed(1), totalCost: +totalCost.toFixed(2), txFee: +txFee.toFixed(2) };
}

function predictFutureCosts(product, monthsAhead = 6) {
  const drivers = product.costDrivers.map(d => COST_DRIVERS[d]).filter(Boolean);
  let avgIncrease = 0;
  drivers.forEach(d => {
    const match = d.forecast6m.match(/([\d.]+)/);
    if (match) avgIncrease += parseFloat(match[0]);
  });
  avgIncrease = drivers.length > 0 ? avgIncrease / drivers.length : 0;

  const futureCost = product.costPrice * (1 + avgIncrease / 100);
  const futureShipping = product.shippingCost * (1 + (COST_DRIVERS.logistics ? 0.15 : 0));
  const currentProfit = calcProfit(product).profit;

  const futureProduct = { ...product, costPrice: futureCost, shippingCost: futureShipping };
  const futureProfit = calcProfit(futureProduct).profit;

  return {
    currentCost: product.costPrice,
    futureCost: +futureCost.toFixed(2),
    costIncrease: +(futureCost - product.costPrice).toFixed(2),
    currentProfit,
    futureProfit: +futureProfit.toFixed(2),
    profitImpact: +(futureProfit - currentProfit).toFixed(2),
    drivers,
    avgIncreasePct: +avgIncrease.toFixed(1),
  };
}

function competitorPosition(product) {
  const prices = product.competitors.map(c => c.price);
  const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const position = product.sellPrice < avg ? "below_avg" : product.sellPrice > avg ? "above_avg" : "at_avg";
  const pctVsAvg = (((product.sellPrice - avg) / avg) * 100).toFixed(1);
  return { avg: +avg.toFixed(2), min, max, position, pctVsAvg: +pctVsAvg, competitors: product.competitors };
}

// ─── Enrich all products ──────────────────────────────────────────────────
function enrichProducts() {
  return PRODUCTS.map(p => {
    const profitData = calcProfit(p);
    const stockout = predictStockout(p);
    const futureCosts = predictFutureCosts(p);
    const compData = competitorPosition(p);
    const salesLast30 = p.monthlySales[CURRENT_MONTH_IDX];
    const salesLast7 = Math.round(salesLast30 / 4.3);
    const trend = p.monthlySales[CURRENT_MONTH_IDX] > p.monthlySales[CURRENT_MONTH_IDX - 1] ? "rising" : p.monthlySales[CURRENT_MONTH_IDX] < p.monthlySales[CURRENT_MONTH_IDX - 1] ? "declining" : "stable";
    return { ...p, ...profitData, stockout, futureCosts, compData, salesLast30, salesLast7, trend };
  }).sort((a, b) => a.stockout.totalDays - b.stockout.totalDays);
}

// ─── AI System Prompt ─────────────────────────────────────────────────────
function buildSystemPrompt(products) {
  return `You are ProfitPilot AI — an advanced commerce intelligence system that combines predictive inventory forecasting, true profit analysis, competitor intelligence, and macroeconomic cost predictions.

TODAY: March 28, 2026

PRODUCT DATA WITH FULL ANALYTICS:
${JSON.stringify(products.map(p => ({
  name: p.name, category: p.category,
  sell_price: p.sellPrice,
  true_cost_per_unit: p.totalCost,
  true_profit_per_unit: p.profit,
  margin: p.margin + "%",
  stock_remaining: p.stock,
  predicted_stockout_days: p.stockout.totalDays,
  sales_history_12mo: Object.fromEntries(MONTHS.map((m, i) => [m, p.monthlySales[i]])),
  sales_trend: p.trend,
  demand_forecast_next_6mo: p.stockout.forecast.map(f => ({ month: f.month, predicted_sales: f.predicted, event: f.event, holiday_multiplier: f.holidayMult })),
  competitor_pricing: p.compData.competitors,
  competitor_avg_price: p.compData.avg,
  your_price_vs_competitors: p.compData.pctVsAvg + "% vs avg",
  cost_forecast_6mo: {
    current_cogs: p.futureCosts.currentCost,
    predicted_cogs: p.futureCosts.futureCost,
    cost_increase: p.futureCosts.costIncrease,
    profit_impact: p.futureCosts.profitImpact,
    avg_cost_increase_pct: p.futureCosts.avgIncreasePct + "%",
    cost_drivers: p.futureCosts.drivers.map(d => ({ factor: d.name, trend: d.trend, change: d.change, forecast: d.forecast6m, reason: d.reason })),
  },
})), null, 2)}

UPCOMING SEASONAL EVENTS:
${JSON.stringify(SEASONAL_EVENTS.map(e => ({ month_index: e.month, event: e.name, affected_categories: e.categories, sales_multiplier: e.multiplier })), null, 2)}

GLOBAL COST DRIVERS:
${JSON.stringify(Object.values(COST_DRIVERS).map(d => ({ factor: d.name, trend: d.trend, current_change: d.change, forecast_6mo: d.forecast6m, reason: d.reason })), null, 2)}

YOUR CAPABILITIES:
1. PREDICTIVE STOCKOUT: Forecast exactly when each product runs out using historical trends + seasonal patterns + holiday spikes. Account for Black Friday 1.8x, Christmas 2.0x, summer seasonality, etc.
2. TRUE PROFIT ANALYSIS: Real profit after ALL costs (COGS, shipping, ads, platform fees, transaction fees). Identify money-losers.
3. COMPETITOR INTELLIGENCE: Compare pricing vs competitors, identify if overpriced or underpriced, suggest optimal price points.
4. COST PREDICTION: Predict cost increases based on real commodity prices, logistics rates, labor costs. Reference specific factors like "cotton futures up 12%" or "Red Sea rerouting adding 15% to shipping."
5. SEASONAL PLANNING: Recommend stock levels for upcoming holidays/events, when to start ordering, promotional timing.
6. ACTION ITEMS: Every response MUST end with numbered actions the merchant should take.

RESPONSE RULES:
- Lead with the most impactful/shocking insight
- ALWAYS use specific numbers, dates, and dollar amounts
- Reference real-world economic factors by name when discussing cost predictions
- Compare to competitor prices when making pricing suggestions
- When forecasting demand, mention which seasonal events drive the spike
- Keep responses focused (4-8 key points, not walls of text)
- Format currencies with $ and round to 2 decimal places
- For stockout predictions, give specific dates not just "soon"
- When suggesting price changes, show the math (current margin → new margin)`;
}

// ─── Mini Chart Component ─────────────────────────────────────────────────
function SparkChart({ data, forecast, height = 50, color = "#63b6ff", showLabels = false }) {
  const all = [...data, ...forecast.map(f => f.predicted)];
  const max = Math.max(...all, 1);
  const min = Math.min(...all, 0);
  const range = max - min || 1;
  const w = 100 / (all.length - 1);

  const points = all.map((v, i) => `${i * w},${height - ((v - min) / range) * (height - 8) - 4}`).join(" ");
  const histPoints = data.map((v, i) => `${i * w},${height - ((v - min) / range) * (height - 8) - 4}`).join(" ");

  return (
    <svg width="100%" height={height + (showLabels ? 18 : 0)} viewBox={`0 0 100 ${height + (showLabels ? 18 : 0)}`} preserveAspectRatio="none" style={{ display: "block" }}>
      <polyline points={histPoints} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      {forecast.length > 0 && (
        <polyline
          points={all.slice(data.length - 1).map((v, i) => `${(data.length - 1 + i) * w},${height - ((v - min) / range) * (height - 8) - 4}`).join(" ")}
          fill="none" stroke={color} strokeWidth="1.5" strokeDasharray="3,2" strokeLinejoin="round" opacity="0.6"
        />
      )}
      {/* Divider line between historical and forecast */}
      <line x1={(data.length - 1) * w} y1="0" x2={(data.length - 1) * w} y2={height} stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" strokeDasharray="2,2" />
      {/* Holiday markers */}
      {forecast.map((f, i) => f.holidayMult > 1.2 ? (
        <circle key={i} cx={(data.length + i) * w} cy={height - ((f.predicted - min) / range) * (height - 8) - 4} r="2" fill="#ffd93d" />
      ) : null)}
    </svg>
  );
}

// ─── Components ───────────────────────────────────────────────────────────
function MetricCard({ label, value, sub, color, icon, alert }) {
  return (
    <div style={{
      background: alert ? "rgba(255,107,107,0.06)" : "rgba(255,255,255,0.03)",
      border: `1px solid ${alert ? "rgba(255,107,107,0.15)" : "rgba(255,255,255,0.06)"}`,
      borderRadius: 14, padding: "16px 18px", flex: "1 1 150px", minWidth: 150,
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: 10, right: 12, fontSize: 20, opacity: 0.25 }}>{icon}</div>
      <div style={{ fontSize: 10, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 4, fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 800, color, letterSpacing: "-1px" }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: "#6b7280", marginTop: 3 }}>{sub}</div>}
    </div>
  );
}

function CompetitorBar({ product }) {
  const { competitors, avg, min, max } = product.compData;
  const allPrices = [...competitors.map(c => c.price), product.sellPrice];
  const range = Math.max(...allPrices) - Math.min(...allPrices);
  const minP = Math.min(...allPrices) - range * 0.1;
  const maxP = Math.max(...allPrices) + range * 0.1;
  const scale = (p) => ((p - minP) / (maxP - minP)) * 100;

  return (
    <div style={{ marginTop: 10, padding: "12px 0" }}>
      <div style={{ position: "relative", height: 40, background: "rgba(255,255,255,0.03)", borderRadius: 8, overflow: "visible" }}>
        {/* Average line */}
        <div style={{ position: "absolute", left: `${scale(avg)}%`, top: 0, bottom: 0, width: 1, background: "rgba(255,255,255,0.2)", zIndex: 1 }} />
        <div style={{ position: "absolute", left: `${scale(avg)}%`, top: -14, fontSize: 9, color: "#6b7280", transform: "translateX(-50%)" }}>avg ${avg}</div>

        {/* Competitor dots */}
        {competitors.map((c, i) => (
          <div key={i} style={{
            position: "absolute", left: `${scale(c.price)}%`, top: "50%", transform: "translate(-50%, -50%)",
            width: 10, height: 10, borderRadius: "50%", background: "#6b7280", zIndex: 2,
          }}>
            <div style={{ position: "absolute", bottom: -18, left: "50%", transform: "translateX(-50%)", fontSize: 9, color: "#6b7280", whiteSpace: "nowrap" }}>
              ${c.price}
            </div>
          </div>
        ))}

        {/* Your price */}
        <div style={{
          position: "absolute", left: `${scale(product.sellPrice)}%`, top: "50%", transform: "translate(-50%, -50%)",
          width: 14, height: 14, borderRadius: "50%", background: "#6bcb77", border: "2px solid #fff", zIndex: 3,
          boxShadow: "0 0 8px rgba(107,203,119,0.4)",
        }}>
          <div style={{ position: "absolute", top: -18, left: "50%", transform: "translateX(-50%)", fontSize: 10, color: "#6bcb77", fontWeight: 700, whiteSpace: "nowrap" }}>
            You: ${product.sellPrice}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 22, flexWrap: "wrap" }}>
        {competitors.map((c, i) => (
          <div key={i} style={{ fontSize: 11, color: "#8b95a5", display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#6b7280" }} />
            {c.name} · <span style={{ color: "#e8eaed" }}>${c.price}</span> · <span style={{ color: "#6b7280" }}>{c.store}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CostForecastPanel({ product }) {
  const fc = product.futureCosts;
  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ display: "flex", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 120px", background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: 12 }}>
          <div style={{ fontSize: 10, color: "#6b7280", textTransform: "uppercase" }}>Current COGS</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#e8eaed" }}>${fc.currentCost.toFixed(2)}</div>
        </div>
        <div style={{ flex: "1 1 120px", background: "rgba(255,107,107,0.06)", borderRadius: 10, padding: 12, border: "1px solid rgba(255,107,107,0.1)" }}>
          <div style={{ fontSize: 10, color: "#ff6b6b", textTransform: "uppercase" }}>Predicted COGS (6mo)</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#ff6b6b" }}>${fc.futureCost.toFixed(2)}</div>
          <div style={{ fontSize: 11, color: "#ff6b6b" }}>+${fc.costIncrease.toFixed(2)} ({fc.avgIncreasePct}%)</div>
        </div>
        <div style={{ flex: "1 1 120px", background: fc.profitImpact < 0 ? "rgba(255,107,107,0.06)" : "rgba(107,203,119,0.06)", borderRadius: 10, padding: 12 }}>
          <div style={{ fontSize: 10, color: "#6b7280", textTransform: "uppercase" }}>Profit Impact</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: fc.profitImpact < 0 ? "#ff6b6b" : "#6bcb77" }}>
            {fc.profitImpact > 0 ? "+" : ""}${fc.profitImpact.toFixed(2)}
          </div>
          <div style={{ fontSize: 11, color: "#6b7280" }}>per unit</div>
        </div>
      </div>
      {fc.drivers.map((d, i) => (
        <div key={i} style={{
          display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", marginBottom: 4,
          background: "rgba(255,255,255,0.02)", borderRadius: 8, fontSize: 12,
        }}>
          <div style={{
            width: 8, height: 8, borderRadius: "50%",
            background: d.trend === "rising" ? "#ff6b6b" : d.trend === "declining" ? "#6bcb77" : "#ffd93d",
          }} />
          <span style={{ color: "#e8eaed", fontWeight: 600, minWidth: 140 }}>{d.name}</span>
          <span style={{ color: d.trend === "rising" ? "#ff6b6b" : d.trend === "declining" ? "#6bcb77" : "#ffd93d", fontWeight: 700, minWidth: 50 }}>
            {d.change}
          </span>
          <span style={{ color: "#6b7280", fontSize: 11, flex: 1 }}>{d.reason.slice(0, 80)}...</span>
        </div>
      ))}
    </div>
  );
}

function ProductRow({ p, selected, onClick }) {
  const profitColor = p.profit > 10 ? "#6bcb77" : p.profit > 0 ? "#ffd93d" : "#ff6b6b";
  const stockColor = p.stockout.totalDays <= 7 ? "#ff6b6b" : p.stockout.totalDays <= 21 ? "#ffd93d" : "#6bcb77";

  return (
    <div onClick={onClick} style={{
      display: "grid", gridTemplateColumns: "2fr 0.8fr 0.8fr 0.8fr 0.7fr 1.2fr 1fr",
      alignItems: "center", padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)",
      cursor: "pointer", background: selected ? "rgba(99,182,255,0.06)" : "transparent",
      transition: "all 0.15s", fontSize: 12,
    }}
    onMouseEnter={e => { if (!selected) e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
    onMouseLeave={e => { if (!selected) e.currentTarget.style.background = "transparent"; }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 18 }}>{p.emoji}</span>
        <div>
          <div style={{ fontWeight: 600, color: "#e8eaed", fontSize: 12.5 }}>{p.name}</div>
          <div style={{ fontSize: 10, color: "#6b7280" }}>{p.category}</div>
        </div>
      </div>
      <div style={{ color: "#e8eaed", fontWeight: 500 }}>${p.sellPrice}</div>
      <div style={{ color: "#8b95a5" }}>${p.totalCost}</div>
      <div style={{ fontWeight: 700, color: profitColor }}>
        {p.profit > 0 ? "+" : ""}${p.profit}
        <div style={{ fontSize: 10, fontWeight: 400, opacity: 0.7 }}>{p.margin}%</div>
      </div>
      <div style={{ color: "#e8eaed" }}>{p.stock}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
        <div style={{
          width: 7, height: 7, borderRadius: "50%", background: stockColor,
          animation: p.stockout.totalDays <= 7 ? "pulse 1.5s infinite" : "none",
          boxShadow: p.stockout.totalDays <= 7 ? `0 0 6px ${stockColor}` : "none",
        }} />
        <span style={{ color: stockColor, fontWeight: p.stockout.totalDays <= 14 ? 700 : 400, fontSize: 11.5 }}>
          {p.stockout.totalDays >= 999 ? "180+ days" : `${p.stockout.totalDays} days`}
        </span>
      </div>
      <div style={{ fontSize: 11, color: p.compData.pctVsAvg < -10 ? "#6bcb77" : p.compData.pctVsAvg > 10 ? "#ff6b6b" : "#ffd93d" }}>
        {p.compData.pctVsAvg > 0 ? "+" : ""}{p.compData.pctVsAvg}% vs avg
      </div>
    </div>
  );
}

function ChatBubble({ msg }) {
  if (msg.role === "user") {
    return (
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
        <div style={{
          background: "linear-gradient(135deg, #6bcb77, #2d9a3e)", color: "#fff",
          padding: "10px 16px", borderRadius: "16px 16px 4px 16px", maxWidth: "80%", fontSize: 13, lineHeight: 1.5,
        }}>{msg.content}</div>
      </div>
    );
  }
  return (
    <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 12 }}>
      <div style={{
        background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", color: "#cdd4de",
        padding: "12px 16px", borderRadius: "16px 16px 16px 4px", maxWidth: "85%", fontSize: 13, lineHeight: 1.7, whiteSpace: "pre-wrap",
      }}>{msg.content}</div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────
export default function ProfitPilot() {
  const products = useMemo(() => enrichProducts(), []);
  const [selectedId, setSelectedId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [detailTab, setDetailTab] = useState("forecast");
  const chatRef = useRef(null);

  const selected = products.find(p => p.id === selectedId);

  const totalRevenue = products.reduce((s, p) => s + p.sellPrice * p.salesLast30, 0);
  const totalProfit = products.reduce((s, p) => s + p.profit * p.salesLast30, 0);
  const avgMargin = products.reduce((s, p) => s + p.margin, 0) / products.length;
  const criticalStock = products.filter(p => p.stockout.totalDays <= 14).length;
  const avgCostIncrease = products.reduce((s, p) => s + p.futureCosts.avgIncreasePct, 0) / products.length;

  useEffect(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; }, [messages, loading]);

  async function sendMessage(text) {
    if (!text.trim() || loading) return;
    const userMsg = { role: "user", content: text.trim() };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: buildSystemPrompt(products),
          messages: newMsgs.map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      const reply = data.content?.map(b => b.text || "").join("") || "Error.";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Connection error." }]);
    }
    setLoading(false);
  }

  const quickPrompts = [
    "Which products will stock out before Black Friday?",
    "Predict my cost increases for the next 6 months",
    "Am I overpriced or underpriced vs competitors?",
    "Give me a dead stock clearance plan with discounts",
    "What should I reorder TODAY and how much?",
    "Full store P&L health report with actions",
    "How will rising oil prices affect my margins?",
    "Seasonal prep plan for Q2 and Q3",
  ];

  return (
    <div style={{
      width: "100%", height: "100vh", background: "#060810",
      fontFamily: "'DM Sans', system-ui, sans-serif",
      display: "flex", flexDirection: "column", overflow: "hidden", color: "#e8eaed",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes pulse { 0%,100%{box-shadow:0 0 0 0 rgba(255,107,107,0.4)} 50%{box-shadow:0 0 0 6px rgba(255,107,107,0)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn { from{opacity:0;transform:translateX(-10px)} to{opacity:1;transform:translateX(0)} }
        @keyframes typing { 0%,60%,100%{opacity:0.2;transform:scale(0.8)} 30%{opacity:1;transform:scale(1.1)} }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 3px; }
      `}</style>

      {/* Header */}
      <div style={{
        padding: "12px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(255,255,255,0.015)", flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src={LOGO_URL} alt="ProfitPilot" style={{
            width: 44, height: 44, borderRadius: 10,
            objectFit: "cover",
            boxShadow: "0 3px 12px rgba(107,203,119,0.25)",
          }} />
          <div>
            <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: "-0.5px", color: "#fff" }}>ProfitPilot</span>
            <span style={{ fontSize: 9, color: "#6bcb77", marginLeft: 6, fontWeight: 600, background: "rgba(107,203,119,0.1)", padding: "2px 7px", borderRadius: 8 }}>v2</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 2, background: "rgba(255,255,255,0.04)", borderRadius: 9, padding: 2.5, border: "1px solid rgba(255,255,255,0.06)" }}>
          {[{ key: "dashboard", icon: "📋", label: "Dashboard" }, { key: "copilot", icon: "🤖", label: "AI Copilot" }].map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
              padding: "7px 16px", borderRadius: 7, border: "none", fontSize: 11.5, fontWeight: 600,
              cursor: "pointer", transition: "all 0.2s",
              background: activeTab === t.key ? "linear-gradient(135deg, #6bcb77, #2d9a3e)" : "transparent",
              color: activeTab === t.key ? "#fff" : "#8b95a5",
            }}>{t.icon} {t.label}</button>
          ))}
        </div>
      </div>

      {activeTab === "dashboard" ? (
        <div style={{ flex: 1, overflow: "auto", padding: "16px 18px", animation: "fadeIn 0.3s ease" }}>
          {/* Metrics */}
          <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
            <MetricCard label="Monthly Revenue" value={`$${totalRevenue.toFixed(0)}`} color="#63b6ff" icon="💰" />
            <MetricCard label="True Net Profit" value={`$${totalProfit.toFixed(0)}`} sub={`${((totalProfit/totalRevenue)*100).toFixed(1)}% net`} color={totalProfit > 0 ? "#6bcb77" : "#ff6b6b"} icon="📈" />
            <MetricCard label="Avg Margin" value={`${avgMargin.toFixed(1)}%`} color="#ffd93d" icon="🎯" />
            <MetricCard label="Stock Alerts" value={criticalStock} sub="Need reorder ≤14d" color={criticalStock > 0 ? "#ff6b6b" : "#6bcb77"} icon="🚨" alert={criticalStock > 0} />
            <MetricCard label="Cost Pressure" value={`+${avgCostIncrease.toFixed(1)}%`} sub="Avg 6mo forecast" color="#ff6b6b" icon="📦" />
          </div>

          {/* Table */}
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, overflow: "hidden" }}>
            <div style={{
              display: "grid", gridTemplateColumns: "2fr 0.8fr 0.8fr 0.8fr 0.7fr 1.2fr 1fr",
              padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)",
              fontSize: 9.5, textTransform: "uppercase", letterSpacing: "0.8px", color: "#6b7280", fontWeight: 600,
            }}>
              <div>Product</div><div>Price</div><div>True Cost</div><div>Profit</div><div>Stock</div><div>Stockout In</div><div>vs Competitors</div>
            </div>
            {products.map(p => (
              <ProductRow key={p.id} p={p} selected={selectedId === p.id} onClick={() => setSelectedId(selectedId === p.id ? null : p.id)} />
            ))}
          </div>

          {/* Detail Panel */}
          {selected && (
            <div style={{
              marginTop: 14, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 12, padding: 18, animation: "slideIn 0.3s ease",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
                    {selected.emoji} {selected.name}
                  </div>
                  <div style={{ fontSize: 12, color: "#6b7280", marginTop: 3 }}>
                    ${selected.sellPrice} sell → ${selected.totalCost} true cost → <span style={{ color: selected.profit > 0 ? "#6bcb77" : "#ff6b6b", fontWeight: 700 }}>
                      {selected.profit > 0 ? "+" : ""}${selected.profit}/unit ({selected.margin}%)
                    </span>
                  </div>
                </div>
                <div style={{
                  padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 700,
                  background: selected.stockout.totalDays <= 14 ? "rgba(255,107,107,0.12)" : "rgba(107,203,119,0.12)",
                  color: selected.stockout.totalDays <= 14 ? "#ff6b6b" : "#6bcb77",
                }}>
                  {selected.stockout.totalDays >= 999 ? "180+ days supply" : `Stockout in ${selected.stockout.totalDays} days`}
                </div>
              </div>

              {/* Detail Tabs */}
              <div style={{ display: "flex", gap: 4, marginBottom: 14, borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: 8 }}>
                {[
                  { key: "forecast", label: "📈 Demand Forecast" },
                  { key: "costs", label: "💸 Cost Prediction" },
                  { key: "competitors", label: "🏷️ Competitors" },
                ].map(t => (
                  <button key={t.key} onClick={() => setDetailTab(t.key)} style={{
                    padding: "6px 14px", borderRadius: 6, border: "none", fontSize: 11, fontWeight: 600,
                    cursor: "pointer", background: detailTab === t.key ? "rgba(107,203,119,0.12)" : "transparent",
                    color: detailTab === t.key ? "#6bcb77" : "#8b95a5",
                  }}>{t.label}</button>
                ))}
              </div>

              {detailTab === "forecast" && (
                <div>
                  <div style={{ marginBottom: 10 }}>
                    <SparkChart data={selected.monthlySales} forecast={selected.stockout.forecast} height={60} color="#63b6ff" />
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "#6b7280", marginTop: 4, padding: "0 2px" }}>
                      <span>← Historical (12mo)</span><span>Forecast (6mo) →</span>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 6, marginTop: 10 }}>
                    {selected.stockout.forecast.map((f, i) => (
                      <div key={i} style={{
                        background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: 10, textAlign: "center",
                        border: f.holidayMult > 1.2 ? "1px solid rgba(255,217,61,0.2)" : "1px solid transparent",
                      }}>
                        <div style={{ fontSize: 10, color: "#6b7280", marginBottom: 4 }}>{f.month}</div>
                        <div style={{ fontSize: 18, fontWeight: 800, color: "#63b6ff" }}>{f.predicted}</div>
                        <div style={{ fontSize: 9, color: "#6b7280" }}>units</div>
                        {f.event && f.holidayMult > 1.1 && (
                          <div style={{ fontSize: 9, color: "#ffd93d", marginTop: 4, fontWeight: 600 }}>
                            🎉 {f.event}
                            <br />{f.holidayMult}x boost
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                    <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: 12 }}>
                      <div style={{ fontSize: 10, color: "#6b7280", textTransform: "uppercase" }}>6mo Demand</div>
                      <div style={{ fontSize: 20, fontWeight: 800, color: "#63b6ff" }}>
                        {selected.stockout.forecast.reduce((s, f) => s + f.predicted, 0)}
                      </div>
                      <div style={{ fontSize: 10, color: "#6b7280" }}>total units needed</div>
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: 12 }}>
                      <div style={{ fontSize: 10, color: "#6b7280", textTransform: "uppercase" }}>Reorder Qty</div>
                      <div style={{ fontSize: 20, fontWeight: 800, color: "#ffd93d" }}>
                        {Math.max(0, selected.stockout.forecast.reduce((s, f) => s + f.predicted, 0) - selected.stock)}
                      </div>
                      <div style={{ fontSize: 10, color: "#6b7280" }}>units to cover 6mo</div>
                    </div>
                    <div style={{ background: selected.stockout.totalDays <= 14 ? "rgba(255,107,107,0.08)" : "rgba(255,255,255,0.03)", borderRadius: 8, padding: 12 }}>
                      <div style={{ fontSize: 10, color: "#6b7280", textTransform: "uppercase" }}>Order By</div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: selected.stockout.totalDays <= 14 ? "#ff6b6b" : "#6bcb77" }}>
                        {selected.stockout.totalDays <= 7 ? "NOW!" : selected.stockout.totalDays <= 14 ? "This week" : selected.stockout.totalDays <= 30 ? "This month" : "No rush"}
                      </div>
                      <div style={{ fontSize: 10, color: "#6b7280" }}>~7 day lead time</div>
                    </div>
                  </div>
                </div>
              )}

              {detailTab === "costs" && <CostForecastPanel product={selected} />}
              {detailTab === "competitors" && <CompetitorBar product={selected} />}

              <button
                onClick={() => { setActiveTab("copilot"); setTimeout(() => sendMessage(`Full analysis of ${selected.name}: demand forecast with seasonal events, cost predictions with real-world factors, competitor positioning, and recommended actions`), 100); }}
                style={{
                  marginTop: 14, width: "100%", padding: "11px", borderRadius: 9,
                  background: "linear-gradient(135deg, #6bcb77, #2d9a3e)",
                  border: "none", color: "#fff", fontSize: 12.5, fontWeight: 700, cursor: "pointer",
                }}
              >🤖 Ask AI for Deep Analysis on {selected.name}</button>
            </div>
          )}
        </div>
      ) : (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", animation: "fadeIn 0.3s ease" }}>
          <div ref={chatRef} style={{ flex: 1, overflow: "auto", padding: "18px 20px" }}>
            {messages.length === 0 && (
              <div style={{ textAlign: "center", paddingTop: 24 }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>🧠</div>
                <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 6, letterSpacing: "-0.5px" }}>ProfitPilot AI Copilot</h2>
                <p style={{ fontSize: 12, color: "#6b7280", maxWidth: 440, margin: "0 auto 20px" }}>
                  I analyze your inventory, predict stockouts with seasonal patterns, forecast cost changes from real-world events, and benchmark against competitors.
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7, justifyContent: "center", maxWidth: 540, margin: "0 auto" }}>
                  {quickPrompts.map(q => (
                    <button key={q} onClick={() => sendMessage(q)} style={{
                      background: "rgba(107,203,119,0.08)", border: "1px solid rgba(107,203,119,0.2)",
                      color: "#6bcb77", padding: "7px 14px", borderRadius: 18, fontSize: 11.5,
                      cursor: "pointer", transition: "all 0.15s",
                    }}
                    onMouseEnter={e => e.target.style.background = "rgba(107,203,119,0.15)"}
                    onMouseLeave={e => e.target.style.background = "rgba(107,203,119,0.08)"}
                    >{q}</button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m, i) => <ChatBubble key={i} msg={m} />)}
            {loading && (
              <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 12 }}>
                <div style={{ background: "rgba(255,255,255,0.04)", padding: "14px 20px", borderRadius: "16px 16px 16px 4px", display: "flex", gap: 5 }}>
                  {[0,1,2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "#6bcb77", animation: `typing 1.4s infinite`, animationDelay: `${i*0.2}s`, opacity: 0.4 }} />)}
                </div>
              </div>
            )}
          </div>
          <div style={{ padding: "12px 20px 16px", borderTop: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
            <div style={{
              display: "flex", gap: 8, background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12,
              padding: "3px 3px 3px 16px", alignItems: "center",
            }}>
              <input
                value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage(input)}
                placeholder="Ask about profits, stockouts, competitors, cost forecasts..."
                style={{ flex: 1, border: "none", background: "transparent", color: "#e8eaed", fontSize: 13, outline: "none", padding: "9px 0" }}
              />
              <button onClick={() => sendMessage(input)} disabled={loading || !input.trim()} style={{
                background: input.trim() ? "linear-gradient(135deg, #6bcb77, #2d9a3e)" : "rgba(255,255,255,0.06)",
                border: "none", color: "#fff", width: 38, height: 38, borderRadius: 9,
                cursor: input.trim() ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16, flexShrink: 0,
              }}>↑</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ padding: "6px 0", textAlign: "center", fontSize: 9.5, color: "#1e2230", borderTop: "1px solid rgba(255,255,255,0.03)", flexShrink: 0 }}>
        ProfitPilot v2 · AI Commerce Intelligence · Growzilla × Forest City Hackathon · Powered by Claude
      </div>
    </div>
  );
}
