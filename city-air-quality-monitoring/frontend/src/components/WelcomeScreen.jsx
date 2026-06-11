import React from 'react';

const FEATURES = [
  { icon:'🌬️', label:'Real-Time AQI' },
  { icon:'🧪', label:'8 Pollutants' },
  { icon:'📅', label:'5-Day Forecast' },
  { icon:'⏱️', label:'24h Hourly Strip' },
  { icon:'💊', label:'Health Advice' },
  { icon:'📊', label:'4 Charts' },
  { icon:'🎯', label:'Radar Analysis' },
  { icon:'🔄', label:'Auto-Refresh' },
];

const CITIES = [
  {name:'Mumbai',   country:'India',         latitude:19.076,  longitude:72.877},
  {name:'Beijing',  country:'China',          latitude:39.904,  longitude:116.407},
  {name:'London',   country:'UK',             latitude:51.508,  longitude:-0.128},
  {name:'New York', country:'USA',            latitude:40.713,  longitude:-74.006},
  {name:'Delhi',    country:'India',          latitude:28.635,  longitude:77.224},
  {name:'Tokyo',    country:'Japan',          latitude:35.689,  longitude:139.692},
  {name:'Dubai',    country:'UAE',            latitude:25.204,  longitude:55.270},
  {name:'Lahore',   country:'Pakistan',       latitude:31.558,  longitude:74.352},
];

export default function WelcomeScreen({ onCitySelect }) {
  return (
    <div style={s.card}>
      <div style={s.iconWrap}>
        <span style={s.icon}>🌬️</span>
        <div style={s.iconRing} />
      </div>
      <h1 style={s.title}>City Air Quality Monitoring &amp; Forecasting</h1>
      <p style={s.sub}>
        Monitor real-time PM₂.₅, PM₁₀, NO₂, O₃, SO₂, CO and more with live data,
        5-day AQI forecasts, and personalised health recommendations for any city worldwide.
      </p>

      <div style={s.feats}>
        {FEATURES.map((f, i) => (
          <div key={i} style={s.feat}>
            <span>{f.icon}</span>
            <span style={s.featLabel}>{f.label}</span>
          </div>
        ))}
      </div>

      <p style={s.prompt}>Quick start — select a city:</p>
      <div style={s.cities}>
        {CITIES.map((c, i) => (
          <button key={i} style={s.cityBtn}
            onClick={() => onCitySelect(c)}
            onMouseEnter={e => { e.currentTarget.style.background='rgba(0,212,255,0.1)'; e.currentTarget.style.borderColor='#00D4FF'; e.currentTarget.style.color='#00D4FF'; }}
            onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.1)'; e.currentTarget.style.color='#E2EAFF'; }}>
            {c.name}
            <span style={s.cityCountry}>{c.country}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

const s = {
  card: {
    background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)',
    borderRadius:'18px', padding:'3rem 2rem', textAlign:'center',
    marginBottom:'1rem', position:'relative', overflow:'hidden',
  },
  iconWrap: { position:'relative', display:'inline-block', marginBottom:'1.2rem' },
  icon: {
    fontSize:'56px', display:'block',
    filter:'drop-shadow(0 0 20px rgba(0,212,255,0.4))',
    animation:'breathe 3s ease-in-out infinite',
  },
  iconRing: {
    position:'absolute', inset:'-8px', borderRadius:'50%',
    border:'1px solid rgba(0,212,255,0.15)',
    animation:'ripple 3s ease-in-out infinite',
  },
  title: {
    fontFamily:"'Orbitron',monospace", fontSize:'20px', fontWeight:700,
    letterSpacing:'0.04em', marginBottom:'12px',
    background:'linear-gradient(90deg,#00D4FF,#00FFF7,#7C6AFF)',
    WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
  },
  sub: {
    fontSize:'13px', color:'rgba(180,200,255,0.65)', maxWidth:'520px',
    margin:'0 auto 1.8rem', lineHeight:1.7,
  },
  feats: {
    display:'flex', flexWrap:'wrap', justifyContent:'center',
    gap:'8px', marginBottom:'2rem',
  },
  feat: {
    display:'flex', alignItems:'center', gap:'5px',
    background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)',
    borderRadius:'6px', padding:'5px 12px',
    fontSize:'11px', color:'rgba(180,200,255,0.6)',
  },
  featLabel: { fontFamily:"'JetBrains Mono',monospace", fontSize:'10px', letterSpacing:'0.04em' },
  prompt: { fontSize:'12px', color:'rgba(130,160,220,0.4)', marginBottom:'12px', fontFamily:"'JetBrains Mono',monospace", letterSpacing:'0.1em' },
  cities: { display:'flex', flexWrap:'wrap', justifyContent:'center', gap:'8px' },
  cityBtn: {
    display:'flex', alignItems:'center', gap:'8px',
    background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.1)',
    borderRadius:'8px', padding:'8px 18px',
    color:'#E2EAFF', fontSize:'13px', fontWeight:600,
    cursor:'pointer', transition:'all 0.2s', letterSpacing:'0.03em',
  },
  cityCountry: { fontSize:'10px', color:'rgba(180,200,255,0.5)', fontWeight:400 },
};
