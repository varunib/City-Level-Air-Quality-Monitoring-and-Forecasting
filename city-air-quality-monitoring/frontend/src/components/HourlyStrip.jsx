import React from 'react';
import { getAQILevel, formatTime } from '../utils/aqiHelpers';

export default function HourlyStrip({ hourlyForecast }) {
  if (!hourlyForecast?.length) return null;
  return (
    <div style={s.card}>
      <div style={s.header}>
        <span style={s.title}>24-Hour Hourly Forecast</span>
        <span style={s.badge}>Scroll → for all hours</span>
      </div>
      <div style={s.strip}>
        {hourlyForecast.map((h, i) => {
          const level = getAQILevel(h.usAqi || 0);
          return (
            <div key={i}
              style={{
                ...s.card2,
                borderColor: h.isCurrent ? '#00D4FF' : 'rgba(255,255,255,0.07)',
                background:  h.isCurrent ? 'rgba(0,212,255,0.07)' : 'rgba(255,255,255,0.025)',
              }}
              onMouseEnter={e=>{ e.currentTarget.style.borderColor=level.color; e.currentTarget.style.background=`${level.color}11`; }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor=h.isCurrent?'#00D4FF':'rgba(255,255,255,0.07)'; e.currentTarget.style.background=h.isCurrent?'rgba(0,212,255,0.07)':'rgba(255,255,255,0.025)'; }}>
              <div style={s.timeLabel}>
                {h.isCurrent ? 'NOW' : formatTime(h.time)}
              </div>
              <div style={{...s.aqiVal, color: level.color}}>
                {Math.round(h.usAqi || 0)}
              </div>
              <div style={s.shortLabel}>{level.label.split(' ')[0]}</div>
              <div style={s.pm25Val}>{h.pm25}</div>
              <div style={{...s.barH, background:`${level.color}66`}} />
            </div>
          );
        })}
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
    display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'0.9rem',
  },
  title: {
    fontFamily:"'Orbitron',monospace", fontSize:'12px', fontWeight:600,
    letterSpacing:'0.1em', color:'#E2EAFF',
  },
  badge: {
    fontFamily:"'JetBrains Mono',monospace", fontSize:'9px',
    color:'rgba(130,160,220,0.4)', letterSpacing:'0.08em',
  },
  strip: {
    display:'flex', gap:'0.5rem', overflowX:'auto', paddingBottom:'4px',
    scrollbarWidth:'thin', scrollbarColor:'rgba(255,255,255,0.1) transparent',
  },
  card2: {
    flexShrink:0, width:'68px',
    border:'1px solid rgba(255,255,255,0.07)',
    borderRadius:'10px', padding:'0.65rem 0.4rem',
    textAlign:'center', transition:'all 0.2s', cursor:'default',
  },
  timeLabel: {
    fontFamily:"'JetBrains Mono',monospace", fontSize:'8px',
    color:'rgba(130,160,220,0.45)', marginBottom:'5px', letterSpacing:'0.04em',
  },
  aqiVal: {
    fontFamily:"'Orbitron',monospace", fontSize:'17px',
    fontWeight:700, lineHeight:1, marginBottom:'2px',
  },
  shortLabel: {
    fontSize:'8px', color:'rgba(180,200,255,0.4)',
    marginBottom:'3px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
  },
  pm25Val: {
    fontFamily:"'JetBrains Mono',monospace", fontSize:'9px',
    color:'rgba(180,200,255,0.4)', marginBottom:'4px',
  },
  barH: { width:'100%', height:'2px', borderRadius:'1px' },
};
