import React from 'react';
import { getAQILevel } from '../utils/aqiHelpers';

export default function HealthRecommendations({ health, aqi }) {
  if (!health?.length) return null;
  const level = getAQILevel(aqi || 0);

  return (
    <div style={s.card}>
      <div style={s.header}>
        <div style={s.title}>Health Recommendations</div>
        <div style={{...s.badge, background:level.bg, color:level.color, border:`1px solid ${level.color}44`}}>
          {level.emoji} AQI {Math.round(aqi||0)} · {level.label}
        </div>
      </div>
      <div style={s.grid}>
        {health.map((h, i) => (
          <div key={i} style={s.recCard}
            onMouseEnter={e=>{ e.currentTarget.style.borderColor=level.color+'44'; }}
            onMouseLeave={e=>{ e.currentTarget.style.borderColor='rgba(255,255,255,0.07)'; }}>
            <div style={s.groupIcon}>{h.icon}</div>
            <div style={s.group}>{h.group}</div>
            <div style={s.rec}>{h.recommendation}</div>
            <div style={{...s.levelPill, background:`${level.color}18`, color:level.color, border:`1px solid ${level.color}33`}}>
              {level.label}
            </div>
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
  header: {
    display:'flex', alignItems:'center', justifyContent:'space-between',
    marginBottom:'1rem', flexWrap:'wrap', gap:'8px',
  },
  title: {
    fontFamily:"'Orbitron',monospace", fontSize:'12px', fontWeight:600,
    letterSpacing:'0.1em', color:'#E2EAFF',
  },
  badge: {
    fontFamily:"'JetBrains Mono',monospace", fontSize:'10px',
    letterSpacing:'0.06em', padding:'4px 12px', borderRadius:'6px',
  },
  grid: {
    display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'0.75rem',
  },
  recCard: {
    background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.07)',
    borderRadius:'12px', padding:'1rem 1.1rem', transition:'border-color 0.2s',
  },
  groupIcon: { fontSize:'22px', marginBottom:'6px' },
  group: {
    fontFamily:"'Orbitron',monospace", fontSize:'11px', fontWeight:600,
    letterSpacing:'0.04em', marginBottom:'5px', color:'#E2EAFF',
  },
  rec: { fontSize:'11px', color:'rgba(180,200,255,0.6)', lineHeight:1.55, marginBottom:'8px' },
  levelPill: {
    display:'inline-flex', alignItems:'center',
    fontFamily:"'JetBrains Mono',monospace", fontSize:'8px',
    letterSpacing:'0.08em', padding:'2px 8px', borderRadius:'3px',
  },
};
