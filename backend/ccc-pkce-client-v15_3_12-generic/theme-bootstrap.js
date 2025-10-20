
// theme-bootstrap.js (v15_3_12) — HARD text color: black in light, white in dark (Chart.js v4)
(function(){
  function isDark(){
    const dt = document.documentElement.getAttribute('data-theme');
    if (dt === 'dark') return true;
    if (dt === 'light') return false;
    // fallback to media query if not set
    const mq = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
    return !!(mq && mq.matches);
  }
  function textColor(){
    return isDark() ? '#FFFFFF' : '#000000';
  }
  function applyToChart(chart){
    const t = textColor();
    const grid = getComputedStyle(document.documentElement).getPropertyValue('--chart-grid').trim() || (isDark() ? '#374151' : '#E5E7EB');
    chart.options.plugins = chart.options.plugins || {};
    if (chart.options.plugins.legend){
      chart.options.plugins.legend.labels = Object.assign({}, chart.options.plugins.legend.labels || {}, { color: t });
    }
    if (chart.options.plugins.tooltip){
      chart.options.plugins.tooltip.titleColor  = t;
      chart.options.plugins.tooltip.bodyColor   = t;
      chart.options.plugins.tooltip.footerColor = t;
    }
    if (chart.options.plugins.datalabels){
      chart.options.plugins.datalabels.color = t;
    }
    // Options-level scales (if present)
    if (chart.options.scales){
      Object.keys(chart.options.scales).forEach((k) => {
        const s = chart.options.scales[k] || (chart.options.scales[k] = {});
        s.ticks = Object.assign({}, s.ticks || {}, { color: t });
        s.grid  = Object.assign({}, s.grid  || {},  { color: grid });
      });
    }
    // Runtime scales (always present after init/update)
    if (chart.scales){
      Object.keys(chart.scales).forEach((id) => {
        const sc = chart.scales[id];
        if (sc && sc.options){
          sc.options.ticks = Object.assign({}, sc.options.ticks || {}, { color: t });
          if (sc.options.grid) sc.options.grid.color = grid;
          else sc.options.grid = { color: grid };
        }
      });
    }
  }

  if (window.Chart && /^4\./.test(String(Chart.version||""))){
    if (!window.__hardTextColor_v15312){
      window.__hardTextColor_v15312 = true;
      // Global defaults for good measure
      const t = textColor();
      Chart.defaults.color = t;
      Chart.defaults.scale = Chart.defaults.scale || {};
      Chart.defaults.scale.ticks = Object.assign({}, Chart.defaults.scale.ticks || {}, { color: t });

      Chart.register({
        id: 'hardTextColor',
        beforeInit: applyToChart,
        beforeUpdate: applyToChart,
        afterUpdate: applyToChart,
        beforeDraw: applyToChart
      });

      // Retheme on theme toggle
      const rerender = () => {
        const charts = Chart.instances ? Object.values(Chart.instances) : (window.__charts || []);
        charts.forEach(ch => { try { applyToChart(ch); ch.update('none'); } catch(e){} });
      };
      new MutationObserver(rerender).observe(document.documentElement, { attributes:true, attributeFilter:['data-theme'] });
      const mq = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
      if (mq && mq.addEventListener) mq.addEventListener('change', rerender);
    }
  }
})();
