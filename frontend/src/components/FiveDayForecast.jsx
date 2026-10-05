import React from 'react';
import { getAQILevel, DAYS, MONTHS } from '../utils/aqiHelpers';

function DayTile({ dayData, isFirst }) {
  const dt    = new Date(dayData.date);
  const level = getAQILevel(dayData.usAqi || 0);
  const label = isFirst ? 'TODAY' : DAYS[dt.getDay()];

  return (
    <div style={s.tile}
      onMouseEnter={e => { e.currentTarget.style.borderColor=level.color+'55'; e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow=`0 8px 24px rgba(0,0,0,0.4)`; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.07)'; e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}>
      <div style={s.dayLabel}>{label}</div>
      <div style={s.dateLabel}>{dt.getDate()} {MONTHS[dt.getMonth()]}</div>
      <div style={{...s.aqi, color: level.color}}>{dayData.usAqi}</div>
      <div style={{...s.cat, color: level.color}}>{level.label.split(' ')[0]}</div>
      <div style={s.pm25Row}>
        <span style={s.pm25Icon}>●</span>
        <span style={s.pm25Val}>{dayData.pm25}</span>
        <span style={s.pm25Unit}>PM₂.₅</span>
      </div>
      <div style={{...s.rangeTile, background:`${level.color}22`}}>
        <span style={{color:level.color}}>▲ {dayData.maxAqi}</span>
        <span style={{color:'rgba(180,200,255,0.4)'}}>▼ {dayData.minAqi}</span>
      </div>
    </div>
  );
}

export default function FiveDayForecast({ forecast }) {
  if (!forecast?.length) return null;
  return (
    <div style={s.card}>
      <div style={s.header}>
        <span style={s.title}>5-Day AQI Forecast</span>
        <span style={s.badge}>Daily Average</span>
      </div>
      <div style={s.row}>
        {forecast.map((d, i) => <DayTile key={d.date} dayData={d} isFirst={i === 0} />)}
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
    display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1rem',
  },
  title: {
    fontFamily:"'Orbitron',monospace", fontSize:'12px', fontWeight:600,
    letterSpacing:'0.1em', color:'#E2EAFF',
    display:'flex', alignItems:'center', gap:'8px',
  },
  badge: {
    fontFamily:"'JetBrains Mono',monospace", fontSize:'9px',
    color:'rgba(130,160,220,0.4)', letterSpacing:'0.1em',
  },
  row: {
    display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:'0.75rem',
  },
  tile: {
    background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.07)',
    borderRadius:'12px', padding:'0.9rem 0.6rem',
    textAlign:'center', transition:'all 0.22s', cursor:'default',
  },
  dayLabel: {
    fontFamily:"'JetBrains Mono',monospace", fontSize:'9px',
    letterSpacing:'0.14em', textTransform:'uppercase',
    color:'rgba(180,200,255,0.5)', marginBottom:'3px',
  },
  dateLabel: { fontSize:'10px', color:'rgba(180,200,255,0.4)', marginBottom:'8px' },
  aqi: {
    fontFamily:"'Orbitron',monospace", fontSize:'26px',
    fontWeight:800, lineHeight:1, marginBottom:'3px',
  },
  cat: { fontSize:'9px', fontWeight:600, letterSpacing:'0.04em', marginBottom:'6px' },
  pm25Row: {
    display:'flex', alignItems:'center', justifyContent:'center', gap:'3px',
    marginBottom:'5px',
  },
  pm25Icon: { fontSize:'6px', color:'#FF5252' },
  pm25Val: { fontFamily:"'JetBrains Mono',monospace", fontSize:'10px', color:'rgba(180,200,255,0.6)' },
  pm25Unit: { fontSize:'8px', color:'rgba(130,160,220,0.4)' },
  rangeTile: {
    display:'flex', justifyContent:'space-around',
    borderRadius:'4px', padding:'3px 4px', gap:'4px',
    fontFamily:"'JetBrains Mono',monospace", fontSize:'9px',
  },
};
