import React from 'react';
import { POLLUTANTS_META, getAQILevel, fmtVal } from '../utils/aqiHelpers';

function PollutantCard({ meta, value, aqiValue }) {
  const pct   = Math.min(100, Math.round((value || 0) / meta.max * 100));
  const level = aqiValue ? getAQILevel(aqiValue) : null;

  return (
    <div style={s.card}
      onMouseEnter={e => { e.currentTarget.style.borderColor=meta.color+'55'; e.currentTarget.style.transform='translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.07)'; e.currentTarget.style.transform='translateY(0)'; }}>
      <div style={{...s.topBar, background:`linear-gradient(90deg,${meta.gradient[0]},${meta.gradient[1]})`}} />
      <div style={s.name}>{meta.name}</div>
      <div style={s.symbol}>{meta.symbol}</div>
      <div style={s.valueRow}>
        <span style={s.value}>{fmtVal(value)}</span>
        <span style={s.unit}>{meta.unit}</span>
      </div>
      <div style={s.barTrack}>
        <div style={{...s.barFill, width:`${pct}%`, background:`linear-gradient(90deg,${meta.gradient[0]},${meta.gradient[1]})`}} />
      </div>
      {level && (
        <div style={{...s.badge, background:`${level.color}18`, color:level.color, border:`1px solid ${level.color}33`}}>
          {aqiValue} · {level.label}
        </div>
      )}
    </div>
  );
}

export default function PollutantGrid({ pollutants, pollutantAqi }) {
  if (!pollutants) return null;
  return (
    <div style={s.wrap}>
      <div style={s.header}>
        <span style={s.headerTitle}>Pollutant Breakdown</span>
        <span style={s.headerBadge}>μg/m³ · live</span>
      </div>
      <div style={s.grid}>
        {POLLUTANTS_META.map(meta => (
          <PollutantCard
            key={meta.key}
            meta={meta}
            value={pollutants[meta.key]}
            aqiValue={pollutantAqi?.[meta.key]}
          />
        ))}
      </div>
    </div>
  );
}

const s = {
  wrap: {
    background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)',
    borderRadius:'18px', padding:'1.2rem 1.5rem',
  },
  header: {
    display:'flex', alignItems:'center', justifyContent:'space-between',
    marginBottom:'1rem',
  },
  headerTitle: {
    fontFamily:"'Orbitron',monospace", fontSize:'12px', fontWeight:600,
    letterSpacing:'0.1em', color:'#E2EAFF',
    display:'flex', alignItems:'center', gap:'8px',
  },
  headerBadge: {
    fontFamily:"'JetBrains Mono',monospace", fontSize:'9px',
    color:'rgba(130,160,220,0.4)', letterSpacing:'0.1em',
  },
  grid: {
    display:'grid', gridTemplateColumns:'repeat(4,1fr)',
    gap:'0.7rem',
  },
  card: {
    background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.07)',
    borderRadius:'12px', padding:'0.85rem 0.9rem',
    position:'relative', overflow:'hidden',
    transition:'all 0.25s', cursor:'default',
  },
  topBar: { position:'absolute', top:0, left:0, right:0, height:'2px', borderRadius:'12px 12px 0 0' },
  name: {
    fontFamily:"'JetBrains Mono',monospace", fontSize:'9px',
    letterSpacing:'0.12em', textTransform:'uppercase',
    color:'rgba(130,160,220,0.4)', marginBottom:'4px',
  },
  symbol: {
    fontFamily:"'Orbitron',monospace", fontSize:'17px',
    fontWeight:700, color:'white', marginBottom:'2px', letterSpacing:'0.03em',
  },
  valueRow: { display:'flex', alignItems:'baseline', gap:'3px', marginBottom:'5px' },
  value: {
    fontFamily:"'Orbitron',monospace", fontSize:'19px',
    fontWeight:700, color:'white',
  },
  unit: { fontSize:'9px', color:'rgba(180,200,255,0.5)' },
  barTrack: {
    width:'100%', height:'3px', background:'rgba(255,255,255,0.05)',
    borderRadius:'2px', overflow:'hidden', marginBottom:'5px',
  },
  barFill: {
    height:'100%', borderRadius:'2px',
    transition:'width 0.8s cubic-bezier(0.23,1,0.32,1)',
  },
  badge: {
    display:'inline-flex', alignItems:'center',
    fontFamily:"'JetBrains Mono',monospace", fontSize:'8px',
    letterSpacing:'0.06em', padding:'2px 7px',
    borderRadius:'3px', fontWeight:500,
  },
};
