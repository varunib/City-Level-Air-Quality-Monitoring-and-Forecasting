import React from 'react';
import { getAQILevel } from '../utils/aqiHelpers';

export default function StatsRow({ current }) {
  if (!current) return null;
  const { usAqi, euAqi, pollutants, dominant } = current;
  const level = getAQILevel(usAqi || 0);

  const stats = [
    { label:'US AQI',       value: Math.round(usAqi||0),                 unit:'',       desc: level.label,    color: level.color },
    { label:'EU AQI',       value: Math.round(euAqi||0),                 unit:'',       desc:'European Std',  color:'#7C6AFF' },
    { label:'PM₂.₅',        value: (pollutants?.pm25||0) < 10 ? +(pollutants?.pm25||0).toFixed(1) : Math.round(pollutants?.pm25||0),
      unit:'μg/m³', desc:'Fine Particles', color:'#FF5252' },
    { label:'Dominant',     value: dominant?.symbol || '—',              unit:'',       desc: dominant?.name || '—', color:'#FFEE58' },
  ];

  return (
    <div style={s.row}>
      {stats.map((st, i) => (
        <div key={i} style={s.tile}>
          <div style={s.topLine} />
          <div style={s.label}>{st.label}</div>
          <div style={{...s.value, color: st.color}}>
            {st.value}
            {st.unit && <span style={s.unit}> {st.unit}</span>}
          </div>
          <div style={s.desc}>{st.desc}</div>
        </div>
      ))}
    </div>
  );
}

const s = {
  row: {
    display:'grid', gridTemplateColumns:'repeat(4,1fr)',
    gap:'0.75rem', marginBottom:'1rem',
  },
  tile: {
    background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.07)',
    borderRadius:'14px', padding:'0.95rem 1.1rem',
    position:'relative', overflow:'hidden',
  },
  topLine: {
    position:'absolute', top:0, left:0, right:0, height:'1px',
    background:'linear-gradient(90deg,transparent,rgba(0,212,255,0.35),transparent)',
  },
  label: {
    fontFamily:"'JetBrains Mono',monospace", fontSize:'9px',
    letterSpacing:'0.15em', textTransform:'uppercase',
    color:'rgba(130,160,220,0.4)', marginBottom:'6px',
  },
  value: {
    fontFamily:"'Orbitron',monospace", fontSize:'22px',
    fontWeight:800, lineHeight:1, marginBottom:'4px',
  },
  unit: { fontSize:'11px', fontWeight:400, color:'rgba(180,200,255,0.5)' },
  desc: { fontSize:'10px', color:'rgba(180,200,255,0.45)' },
};
