import React, { useState, useRef, useEffect, useCallback } from 'react';
import { searchCity } from '../utils/api';

const QUICK = [
  {name:'Mumbai',   country:'India',          latitude:19.076,  longitude:72.877},
  {name:'Beijing',  country:'China',           latitude:39.904,  longitude:116.407},
  {name:'Delhi',    country:'India',           latitude:28.635,  longitude:77.224},
  {name:'London',   country:'United Kingdom',  latitude:51.508,  longitude:-0.128},
  {name:'New York', country:'United States',   latitude:40.713,  longitude:-74.006},
  {name:'Tokyo',    country:'Japan',           latitude:35.689,  longitude:139.692},
  {name:'Dubai',    country:'UAE',             latitude:25.204,  longitude:55.270},
  {name:'Los Angeles',country:'United States', latitude:34.052,  longitude:-118.244},
  {name:'Cairo',    country:'Egypt',           latitude:30.050,  longitude:31.233},
  {name:'Bangkok',  country:'Thailand',        latitude:13.754,  longitude:100.501},
];

export default function SearchBar({ onCitySelect }) {
  const [query,   setQuery]   = useState('');
  const [results, setResults] = useState([]);
  const [open,    setOpen]    = useState(false);
  const [busy,    setBusy]    = useState(false);
  const timer  = useRef(null);
  const wrapRef = useRef(null);

  const doSearch = useCallback(async (q) => {
    if (q.trim().length < 2) { setResults([]); setOpen(false); return; }
    setBusy(true);
    try {
      const res = await searchCity(q);
      setResults(res.data.results || []);
      setOpen(true);
    } catch { setResults([]); }
    finally { setBusy(false); }
  }, []);

  const handleInput = (e) => {
    const v = e.target.value;
    setQuery(v);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => doSearch(v), 300);
  };

  const handleSelect = (city) => {
    setQuery(city.name);
    setOpen(false);
    onCitySelect(city);
  };

  const handleLocate = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(pos => {
      onCitySelect({
        name: 'My Location', country: '',
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      });
    });
  };

  useEffect(() => {
    const close = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  return (
    <div style={s.section}>
      <div style={s.label}>{'// ENTER CITY TO MONITOR'}</div>
      <div style={s.row}>
        <div style={s.wrap} ref={wrapRef}>
          <div style={s.box}>
            <span style={s.prefix}>CMD ›</span>
            <input
              style={s.input}
              value={query}
              onChange={handleInput}
              onKeyDown={e => { if(e.key==='Enter' && results[0]) handleSelect(results[0]); }}
              placeholder="Search city — Mumbai, London, Beijing, Tokyo…"
            />
            {busy && <span style={s.spinner}>⟳</span>}
          </div>
          {open && results.length > 0 && (
            <div style={s.dropdown}>
              {results.map((r, i) => (
                <div key={i} style={s.dropRow} onClick={() => handleSelect(r)}
                  onMouseEnter={e=>e.currentTarget.style.background='rgba(0,212,255,0.06)'}
                  onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                  <div>
                    <span style={s.cityName}>{r.name}</span>
                    {r.admin1 && <span style={s.admin}>, {r.admin1}</span>}
                  </div>
                  <div style={s.dropRight}>
                    <span style={s.countryTag}>{r.country}</span>
                    <span style={s.coords}>{r.latitude.toFixed(2)}°, {r.longitude.toFixed(2)}°</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <button style={s.analyseBtn} onClick={() => results[0] && handleSelect(results[0])}>
          ANALYSE ↗
        </button>
        <button style={s.locateBtn} onClick={handleLocate}>📍 MY LOCATION</button>
      </div>

      <div style={s.pills}>
        {QUICK.map((c, i) => (
          <button key={i} style={s.pill} onClick={() => handleSelect(c)}
            onMouseEnter={e=>{e.currentTarget.style.borderColor='#00D4FF';e.currentTarget.style.color='#00D4FF';}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,0.08)';e.currentTarget.style.color='rgba(160,185,230,0.5)';}}>
            {c.name}
          </button>
        ))}
      </div>
    </div>
  );
}

const s = {
  section: { marginBottom:'1.5rem', position:'relative' },
  label: {
    fontFamily:"'JetBrains Mono',monospace", fontSize:'9px',
    letterSpacing:'0.2em', textTransform:'uppercase',
    color:'rgba(130,160,220,0.35)', marginBottom:'6px',
  },
  row: { display:'flex', gap:'10px', alignItems:'stretch', flexWrap:'wrap' },
  wrap: { flex:1, minWidth:'280px', position:'relative' },
  box: {
    display:'flex', alignItems:'center',
    background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.12)',
    borderRadius:'50px', overflow:'hidden', transition:'all 0.3s',
  },
  prefix: {
    padding:'0 12px 0 20px', fontFamily:"'JetBrains Mono',monospace",
    fontSize:'10px', color:'#00D4FF', opacity:0.7,
    letterSpacing:'0.15em', borderRight:'1px solid rgba(255,255,255,0.08)',
    alignSelf:'stretch', display:'flex', alignItems:'center', flexShrink:0,
  },
  input: {
    flex:1, background:'none', border:'none', outline:'none',
    fontFamily:"'Space Grotesk',sans-serif", fontSize:'14px', fontWeight:500,
    color:'#E2EAFF', padding:'13px 16px', letterSpacing:'0.02em',
  },
  spinner: { padding:'0 14px', color:'#00D4FF', animation:'spin 1s linear infinite', display:'inline-block' },
  dropdown: {
    position:'absolute', top:'calc(100% + 6px)', left:0, right:0,
    background:'rgba(8,12,24,0.97)', border:'1px solid rgba(255,255,255,0.12)',
    borderRadius:'14px', zIndex:200, backdropFilter:'blur(24px)',
    boxShadow:'0 20px 60px rgba(0,0,0,0.7)', overflow:'hidden',
  },
  dropRow: {
    display:'flex', alignItems:'center', justifyContent:'space-between',
    padding:'11px 18px', cursor:'pointer',
    borderBottom:'1px solid rgba(255,255,255,0.05)', transition:'background 0.15s',
    gap:'10px',
  },
  cityName: { fontWeight:600, fontSize:'13px' },
  admin: { color:'rgba(180,200,255,0.6)', fontSize:'11px' },
  dropRight: { display:'flex', alignItems:'center', gap:'10px' },
  countryTag: { fontSize:'11px', color:'rgba(180,200,255,0.5)' },
  coords: { fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', color:'rgba(130,160,220,0.35)' },
  analyseBtn: {
    background:'linear-gradient(135deg,#00D4FF,#00B8A9)',
    border:'none', borderRadius:'50px', color:'#050B14',
    fontFamily:"'Orbitron',monospace", fontSize:'11px', fontWeight:700,
    letterSpacing:'0.12em', padding:'0 24px', cursor:'pointer',
    boxShadow:'0 4px 20px rgba(0,212,255,0.25)', transition:'all 0.2s',
    whiteSpace:'nowrap',
  },
  locateBtn: {
    background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)',
    borderRadius:'50px', color:'rgba(180,200,255,0.6)',
    fontFamily:"'JetBrains Mono',monospace", fontSize:'10px',
    padding:'0 18px', cursor:'pointer', whiteSpace:'nowrap',
    transition:'all 0.2s',
  },
  pills: { display:'flex', gap:'6px', flexWrap:'wrap', marginTop:'10px' },
  pill: {
    background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)',
    borderRadius:'4px', padding:'4px 12px',
    fontFamily:"'JetBrains Mono',monospace", fontSize:'10px',
    color:'rgba(160,185,230,0.5)', cursor:'pointer', transition:'all 0.2s',
    letterSpacing:'0.05em',
  },
};
