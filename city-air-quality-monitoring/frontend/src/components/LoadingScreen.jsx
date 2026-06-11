import React from 'react';

export default function LoadingScreen() {
  return (
    <div style={s.card}>
      <div style={s.loaderWrap}>
        <div style={s.ring1} />
        <div style={s.ring2} />
        <div style={s.ring3} />
        <span style={s.innerIcon}>🌬️</span>
      </div>
      <p style={s.text}>Fetching air quality data…</p>
      <p style={s.sub}>Connecting to Open-Meteo Air Quality API</p>
      <div style={s.dots}>
        <span style={{...s.dot, animationDelay:'0s'}} />
        <span style={{...s.dot, animationDelay:'0.2s'}} />
        <span style={{...s.dot, animationDelay:'0.4s'}} />
      </div>
    </div>
  );
}

const s = {
  card: {
    background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)',
    borderRadius:'18px', padding:'3rem 2rem', textAlign:'center',
    marginBottom:'1rem',
  },
  loaderWrap: {
    position:'relative', width:'80px', height:'80px',
    margin:'0 auto 1.5rem', display:'flex', alignItems:'center', justifyContent:'center',
  },
  ring1: {
    position:'absolute', inset:0, borderRadius:'50%',
    border:'2px solid transparent', borderTopColor:'#00D4FF',
    animation:'spin 1s linear infinite',
  },
  ring2: {
    position:'absolute', inset:'10px', borderRadius:'50%',
    border:'2px solid transparent', borderTopColor:'#00B8A9',
    animation:'spin 1.4s linear infinite reverse',
  },
  ring3: {
    position:'absolute', inset:'22px', borderRadius:'50%',
    border:'1px solid rgba(0,212,255,0.2)',
  },
  innerIcon: { fontSize:'20px', position:'relative', zIndex:1 },
  text: {
    fontFamily:"'Orbitron',monospace", fontSize:'14px', fontWeight:600,
    letterSpacing:'0.1em', color:'#E2EAFF', marginBottom:'6px',
  },
  sub: {
    fontFamily:"'JetBrains Mono',monospace", fontSize:'10px',
    color:'rgba(130,160,220,0.4)', letterSpacing:'0.08em', marginBottom:'1.2rem',
  },
  dots: { display:'flex', justifyContent:'center', gap:'6px' },
  dot: {
    width:'6px', height:'6px', borderRadius:'50%',
    background:'#00D4FF', display:'inline-block',
    animation:'dotBounce 1s ease-in-out infinite',
    boxShadow:'0 0 8px #00D4FF',
  },
};
