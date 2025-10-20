// v15_3 dashboard controller
// --- chart text color helpers (v4-safe) ---
function uiTextColor() {
  return document.documentElement.dataset.theme === 'dark' ? '#FFFFFF' : '#000000';
}
function uiGridColor() {
  const val = getComputedStyle(document.documentElement).getPropertyValue('--chart-grid').trim();
  return val || (document.documentElement.dataset.theme === 'dark' ? '#374151' : '#E5E7EB');
}
function applyChartTextColors(ch) {
  const T = uiTextColor(), G = uiGridColor();

  ch.options.plugins = ch.options.plugins || {};
  // Legend + tooltip
  if (ch.options.plugins.legend) {
    ch.options.plugins.legend.labels = ch.options.plugins.legend.labels || {};
    ch.options.plugins.legend.labels.color = T;
  }
  if (ch.options.plugins.tooltip) {
    ch.options.plugins.tooltip.titleColor  = T;
    ch.options.plugins.tooltip.bodyColor   = T;
    ch.options.plugins.tooltip.footerColor = T;
  }

  // Ensure scales exist; force tick colors
  const sc = ch.options.scales = ch.options.scales || {};
  sc.x = sc.x || {};
  sc.y = sc.y || {};
  sc.x.ticks = Object.assign({}, sc.x.ticks || {}, { color: T });
  sc.y.ticks = Object.assign({}, sc.y.ticks || {}, { color: T });
  // (Optional) grid contrast
  sc.x.grid = Object.assign({}, sc.x.grid || {}, { color: G });
  sc.y.grid = Object.assign({}, sc.y.grid || {}, { color: G });

  ch.update('none');
}

(function(){
  const COLORS = { EC2:"#6ea8ff", S3:"#ff7b7b", RDS:"#ffd166", Lambda:"#44d7b6", CloudWatch:"#a8d1ff" };
  let charts = {bar:null, pie:null};

  function $(id){ return document.getElementById(id); }
  function fmt(n){ return `$${n.toFixed(2)}`; }

  function setTheme(next){
    const body = document.body;
    if(next === "light"){ body.classList.remove("theme-dark"); document.documentElement.classList.add("light"); }
    else { body.classList.add("theme-dark"); document.documentElement.classList.remove("light"); }
    $("toggleThemeBtn").textContent = next==="light" ? "Dark" : "Light";
    // force chart update to ensure text colors adjust
    for(const c of Object.values(charts)){ if(c){ c.update(); } }
  }

  function currentPeriodKey(){
    const sel = $("periodSelect");
    const v = sel ? sel.value : "ytd";
    return v==="lastMonth"?"cost_last_month":v==="thisMonth"?"cost_this_month":v==="last7"?"cost_last_7_days":"cost_ytd";
  }

  async function loadDemoData(key){
    const url = `./demo-data/${key}.json`;
    const r = await fetch(url);
    return await r.json();
  }

  function renderLegend(services){
    const el = $("legend"); el.innerHTML = "";
    for(const [name] of services){
      const dot = document.createElement("span"); dot.className="legend-dot"; dot.style.background = COLORS[name] || "#8898aa";
      const label = document.createElement("span"); label.textContent = name;
      const row = document.createElement("div"); row.style.display="inline-flex"; row.style.alignItems="center"; row.style.gap="6px";
      row.appendChild(dot); row.appendChild(label); el.appendChild(row);
    }
  }

  function renderTopList(services){
    const ul = $("topList"); ul.innerHTML="";
    for(const [name, amt] of services){
      const li = document.createElement("li");
      const a = document.createElement("span"); a.textContent = name;
      const b = document.createElement("strong"); b.textContent = fmt(amt);
      li.appendChild(a); li.appendChild(b); ul.appendChild(li);
    }
  }

  function drawCharts(services){
    const labels = services.map(s=>s[0]);
    const values = services.map(s=>s[1]);
    const colors = labels.map(n => COLORS[n] || "#8898aa");// BAR
    if(charts.bar) charts.bar.destroy();
    charts.bar = new Chart($("barChart"), {
      type:"bar",
      data:{ labels, datasets:[{ label:"Cost", data:values, backgroundColor: colors, borderColor: colors, borderWidth:1 }]},
      options:{ plugins:{ legend:{ display:false } } }
    });
    // PIE
    if(charts.pie) charts.pie.destroy();
    charts.pie = new Chart($("pieChart"), {
      type:"pie",
      data:{ labels, datasets:[{ data:values, backgroundColor: colors, borderColor:"#1a2236", borderWidth:1 }]},
      options:{ plugins:{ legend:{ position:"right" } } }
    });
  }

  function computeSummary(d){
    const total = d.total;
    const [topName,topAmt] = (d.services||[]).slice().sort((a,b)=>b[1]-a[1])[0] || ["-",0];
    $("totalVal").textContent = fmt(total);
    $("topService").textContent = `${topName} (${fmt(topAmt)})`;
    $("svcCount").textContent = String((d.services||[]).length);
  }

  async function refresh(){
    const demoOn = $("demoToggle").checked;
    const key = currentPeriodKey();
    if(demoOn){
      const d = await loadDemoData(key);
      computeSummary(d);
      renderLegend(d.services);
      renderTopList(d.services);
      drawCharts(d.services);
      return;
    }
    // Live mode
    $("totalVal").textContent = "$0.00";
    $("topService").textContent = "- ($0.00)";
    $("svcCount").textContent = "0";
    renderLegend([]); renderTopList([]);
    if(!window.CFG || !window.CFG.apiBase){ return; }
    const at = window.CCCTokens && window.CCCTokens.access();
    const headers = at ? { "Authorization": `Bearer ${at}` } : {};
    const resp = await fetch(`${window.CFG.apiBase}/cost?period=${encodeURIComponent(key)}`, { headers });
    if(!resp.ok){ console.warn("API error", await resp.text()); return; }
    const d = await resp.json();
    computeSummary(d);
    renderLegend(d.services);
    renderTopList(d.services);
    drawCharts(d.services);
  }

  function hookUI(){
    $("periodSelect").addEventListener("change", refresh);
    $("demoToggle").addEventListener("change", refresh);
    $("toggleThemeBtn").addEventListener("click", ()=>{
      const isDark = document.body.classList.contains("theme-dark");
      setTheme(isDark ? "light" : "dark");
    });
    $("explainBtn").addEventListener("click", ()=>{
      if(!$("demoToggle").checked && window.CFG && window.CFG.aiEndpoint && window.CFG.apiBase){
        const at = window.CCCTokens && window.CCCTokens.access();
        const headers = { "Content-Type":"application/json" };
        if(at) headers.Authorization = `Bearer ${at}`;
        fetch(`${window.CFG.apiBase}${window.CFG.aiEndpoint}`, { method:"POST", headers, body: JSON.stringify({ period: currentPeriodKey() }) })
          .then(r=>r.ok?r.json():r.text().then(t=>Promise.reject(t)))
          .then(j=> alert(j.message || j.insight || "Insight generated."))
          .catch(()=> alert("Hook your API or model here to generate an insight."));
      } else {
        alert("Hook your API or model here to generate an insight.");
      }
    });
  }

// Re-apply when theme toggles
new MutationObserver(() => {
  const canvases = Array.from(document.querySelectorAll('canvas'));
  canvases.map(c => Chart.getChart(c)).filter(Boolean).forEach(applyChartTextColors);
}).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  document.addEventListener("DOMContentLoaded", ()=>{
    // initial theme label
    
    if(!document.documentElement.dataset.theme){ document.documentElement.dataset.theme = 'light'; }
$("toggleThemeBtn").textContent = "Light";
    hookUI();
    refresh();
  });
})();