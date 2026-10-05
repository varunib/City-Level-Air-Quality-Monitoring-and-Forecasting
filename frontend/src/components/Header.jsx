import React, { useState, useEffect } from 'react';

export default function Header() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <header style={s.header}>
      <div style={s.brand}>
        <div style={s.logoWrap}>
          <div style={s.logoPulse} />
          <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
            <circle cx="21" cy="21" r="19" stroke="rgba(0,212,255,0.25)" strokeWidth="1"/>
            <circle cx="21" cy="21" r="13" stroke="rgba(0,212,255,0.4)"  strokeWidth="1"/>
            <circle cx="21" cy="21" r="5"  fill="url(#cg)"/>
            <path d="M7 21 Q11 13 17 17 Q21 21 25 13 Q29 7 35 11"
              stroke="url(#lg)" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
            <defs>
              <radialGradient id="cg"><stop stopColor="#00D4FF"/><stop offset="1" stopColor="#00FFF7"/></radialGradient>
              <linearGradient id="lg" x1="7" y1="17" x2="35" y2="11">
                <stop stopColor="#00D4FF"/><stop offset="1" stopColor="#00FFF7"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div>
          <div style={s.title}>CITY AIR QUALITY MONITORING & FORECASTING</div>
          <div style={s.subtitle}>Real-Time Pollution Intelligence Platform</div>
        </div>
      </div>

      <div style={s.meta}>
        <div style={s.liveBadge}>
          <span style={s.liveDot} />
          LIVE
        </div>
        <div style={s.clock}>
          {time.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false})}
        </div>
        <div style={s.apiBadge}>OPEN-METEO AQ API</div>
      </div>
    </header>
  );
}

const s = {
  header: {
    display:'flex', alignItems:'center', justifyContent:'space-between',
    padding:'1.5rem 0 1.2rem', borderBottom:'1px solid rgba(255,255,255,0.06)',
    marginBottom:'1.5rem', flexWrap:'wrap', gap:'1rem',
  },
  brand: { display:'flex', alignItems:'center', gap:'14px' },
  logoWrap: { position:'relative', width:'42px', height:'42px' },
  logoPulse: {
    position:'absolute', inset:0, borderRadius:'50%',
    background:'rgba(0,212,255,0.12)',
    animation:'pulse 2.5s ease-in-out infinite',
  },
  title: {
    fontFamily:"'Orbitron', monospace",
    fontSize:'14px', fontWeight:'700',
    letterSpacing:'0.08em',
    background:'linear-gradient(90deg,#00D4FF,#00FFF7)',
    WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
    backgroundClip:'text',
  },
  subtitle: {
    fontFamily:"'JetBrains Mono',monospace",
    fontSize:'9px', letterSpacing:'0.18em',
    textTransform:'uppercase', color:'rgba(130,160,220,0.4)',
    marginTop:'2px',
  },
  meta: { display:'flex', alignItems:'center', gap:'10px', flexWrap:'wrap' },
  liveBadge: {
    display:'flex', alignItems:'center', gap:'6px',
    background:'rgba(0,230,118,0.08)', border:'1px solid rgba(0,230,118,0.2)',
    borderRadius:'4px', padding:'4px 10px',
    fontFamily:"'JetBrains Mono',monospace", fontSize:'10px',
    color:'#00E676', letterSpacing:'0.12em',
  },
  liveDot: {
    width:'6px', height:'6px', borderRadius:'50%',
    background:'#00E676', boxShadow:'0 0 8px #00E676',
    display:'inline-block', animation:'blink 1.5s ease-in-out infinite',
  },
  clock: {
    fontFamily:"'JetBrains Mono',monospace",
    fontSize:'12px', color:'#00D4FF', opacity:0.75,
    letterSpacing:'0.05em',
  },
  apiBadge: {
    fontFamily:"'JetBrains Mono',monospace", fontSize:'9px',
    letterSpacing:'0.1em', color:'rgba(130,160,220,0.4)',
    background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)',
    borderRadius:'4px', padding:'4px 10px',
  },
};
