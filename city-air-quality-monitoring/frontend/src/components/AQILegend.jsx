import React from 'react';
import { AQI_LEVELS } from '../utils/aqiHelpers';

export default function AQILegend() {
  return (
    <div style={s.card}>
      <div style={s.title}>US AQI Scale Reference</div>
      <div style={s.grid}>
        {AQI_LEVELS.map((l, i) => (
          <div key={i} style={{...s.item, background:l.bg, border:`1px solid ${l.color}33`}}
            onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.borderColor=l.color+'66'; }}
            onMouseLeave={e=>{ e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.borderColor=l.color+'33'; }}>
            <div style={s.emoji}>{l.emoji}</div>
            <div style={{...s.range, color:l.color}}>
              {i===0?'0–50': i===1?'51–100': i===2?'101–150': i===3?'151–200': i===4?'201–300':'301–500'}
            </div>
            <div style={s.label}>{l.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const s = {
  card: {
    background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)',
    borderRadius:'18px', padding:'1.2rem 1.5rem', marginBottom:'1rem',
  },
  title: {
    fontFamily:"'Orbitron',monospace", fontSize:'11px', fontWeight:600,
    letterSpacing:'0.1em', color:'#E2EAFF', marginBottom:'0.85rem',
  },
  grid: {
    display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:'0.5rem',
  },
  item: {
    borderRadius:'10px', padding:'0.7rem 0.5rem',
    textAlign:'center', transition:'all 0.2s', cursor:'default',
  },
  emoji: { fontSize:'18px', marginBottom:'4px' },
  range: {
    fontFamily:"'Orbitron',monospace", fontSize:'11px',
    fontWeight:700, marginBottom:'2px',
  },
  label: { fontSize:'9px', color:'rgba(180,200,255,0.5)', lineHeight:1.3 },
};
