import React, { useEffect, useRef } from 'react';
import { getAQILevel } from '../utils/aqiHelpers';

export default function AQIDialGauge({ aqi, euAqi, city, country, updatedAt, dominant }) {
  const needleRef = useRef(null);
  const numRef    = useRef(null);
  const level     = getAQILevel(aqi || 0);

  useEffect(() => {
    if (needleRef.current) {
      const angle = Math.min(180, Math.max(0, ((aqi || 0) / 300) * 180)) - 90;
      needleRef.current.style.transform = `rotate(${angle}deg)`;
    }
    if (numRef.current) {
      numRef.current.style.color = level.color;
    }
  }, [aqi, level.color]);

  return (
    <div style={s.card}>
      {/* Glow bg */}
      <div style={{...s.glowBg, background:`radial-gradient(circle at 50% 0%, ${level.color}12, transparent 65%)`}} />

      <div style={s.locationRow}>
        <span style={s.locationDot}>📍</span>
        <span style={s.locationLabel}>Real-Time Monitor</span>
        <span style={s.refreshLabel}>Auto-refresh 10m</span>
      </div>

      <div style={s.cityName}>{city || '—'}</div>
      <div style={s.countryName}>{country || ''}</div>

      {/* SVG Gauge */}
      <div style={s.gaugeWrap}>
        <svg width="200" height="120" viewBox="0 0 200 120" style={{filter:`drop-shadow(0 0 14px ${level.color}44)`}}>
          {/* Track */}
          <path d="M 24 108 A 76 76 0 0 1 176 108" fill="none"
            stroke="rgba(255,255,255,0.05)" strokeWidth="14" strokeLinecap="round"/>
          {/* Segments */}
          <path d="M 24 108 A 76 76 0 0 1 62 36"   fill="none" stroke="#00E676" strokeWidth="14" strokeLinecap="round" opacity="0.35"/>
          <path d="M 62 36  A 76 76 0 0 1 100 24"  fill="none" stroke="#FFEE58" strokeWidth="14" strokeLinecap="round" opacity="0.35"/>
          <path d="M 100 24 A 76 76 0 0 1 138 36"  fill="none" stroke="#FF9800" strokeWidth="14" strokeLinecap="round" opacity="0.35"/>
          <path d="M 138 36 A 76 76 0 0 1 176 108" fill="none" stroke="#F44336" strokeWidth="14" strokeLinecap="round" opacity="0.35"/>
          {/* Needle */}
          <line
            ref={needleRef}
            x1="100" y1="104" x2="100" y2="36"
            stroke="white" strokeWidth="2.5" strokeLinecap="round"
            style={{
              transformOrigin:'100px 104px',
              transform:'rotate(-90deg)',
              transition:'transform 1.2s cubic-bezier(0.23,1,0.32,1)',
            }}
          />
          <circle cx="100" cy="104" r="6" fill={level.color} opacity="0.9"/>
          <circle cx="100" cy="104" r="3" fill="white"/>
        </svg>

        <div style={s.gaugeCenter}>
          <div style={{...s.aqiNum, color: level.color}} ref={numRef}>
            {Math.round(aqi || 0)}
          </div>
          <div style={s.aqiLabel}>US AQI</div>
        </div>
      </div>

      {/* Category badge */}
      <div style={{...s.catBadge, background: level.bg, border:`1px solid ${level.color}44`, color: level.color}}>
        <span style={s.catEmoji}>{level.emoji}</span>
        <span style={s.catText}>{level.label}</span>
      </div>

      <p style={s.msg}>{level.desc}</p>

      {/* Mini stats */}
      <div style={s.miniGrid}>
        <div style={s.miniStat}>
          <div style={s.miniVal}>{Math.round(euAqi || 0)}</div>
          <div style={s.miniLbl}>EU AQI</div>
        </div>
        <div style={s.miniStat}>
          <div style={{...s.miniVal, fontSize:'13px'}}>{dominant?.name || '—'}</div>
          <div style={s.miniLbl}>Dominant</div>
        </div>
        <div style={s.miniStat}>
          <div style={s.miniVal}>
            {updatedAt ? new Date(updatedAt).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}) : '—'}
          </div>
          <div style={s.miniLbl}>Updated</div>
        </div>
      </div>
    </div>
  );
}

const s = {
  card: {
    background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)',
    borderRadius:'18px', padding:'1.5rem 1.5rem 1.2rem',
    display:'flex', flexDirection:'column', alignItems:'center',
    position:'relative', overflow:'hidden',
  },
  glowBg: {
    position:'absolute', inset:0, pointerEvents:'none',
    transition:'background 0.8s ease',
  },
  locationRow: {
    display:'flex', alignItems:'center', gap:'6px',
    width:'100%', marginBottom:'6px',
  },
  locationDot: { fontSize:'12px', opacity:0.5 },
  locationLabel: {
    fontFamily:"'JetBrains Mono',monospace", fontSize:'9px',
    letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(130,160,220,0.4)',
  },
  refreshLabel: {
    marginLeft:'auto', fontFamily:"'JetBrains Mono',monospace",
    fontSize:'8px', color:'rgba(0,212,255,0.4)',
    background:'rgba(0,212,255,0.06)', border:'1px solid rgba(0,212,255,0.15)',
    borderRadius:'3px', padding:'1px 6px',
  },
  cityName: {
    fontFamily:"'Orbitron',monospace", fontSize:'18px', fontWeight:700,
    letterSpacing:'0.06em', color:'white', textAlign:'center', marginBottom:'2px',
  },
  countryName: { fontSize:'12px', color:'rgba(180,200,255,0.5)', marginBottom:'1rem', textAlign:'center' },
  gaugeWrap: { position:'relative', width:'200px', height:'120px', marginBottom:'4px' },
  gaugeCenter: {
    position:'absolute', bottom:0, left:'50%', transform:'translateX(-50%)',
    textAlign:'center',
  },
  aqiNum: {
    fontFamily:"'Orbitron',monospace", fontSize:'38px', fontWeight:800,
    lineHeight:1, transition:'color 0.5s',
  },
  aqiLabel: {
    fontFamily:"'JetBrains Mono',monospace", fontSize:'9px',
    letterSpacing:'0.2em', color:'rgba(130,160,220,0.4)',
  },
  catBadge: {
    display:'flex', alignItems:'center', gap:'6px',
    borderRadius:'8px', padding:'6px 14px',
    marginBottom:'8px', transition:'all 0.5s',
  },
  catEmoji: { fontSize:'16px' },
  catText: {
    fontFamily:"'Orbitron',monospace", fontSize:'11px',
    fontWeight:600, letterSpacing:'0.08em',
  },
  msg: {
    fontSize:'11px', color:'rgba(180,200,255,0.55)',
    textAlign:'center', lineHeight:1.5, padding:'0 0.5rem', marginBottom:'1rem',
  },
  miniGrid: {
    display:'grid', gridTemplateColumns:'repeat(3,1fr)',
    gap:'0.5rem', width:'100%',
  },
  miniStat: {
    background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)',
    borderRadius:'8px', padding:'0.6rem', textAlign:'center',
  },
  miniVal: {
    fontFamily:"'Orbitron',monospace", fontSize:'15px',
    fontWeight:700, color:'white', marginBottom:'2px',
  },
  miniLbl: {
    fontFamily:"'JetBrains Mono',monospace", fontSize:'8px',
    letterSpacing:'0.12em', color:'rgba(130,160,220,0.4)',
    textTransform:'uppercase',
  },
};
