import React, { useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine, Cell,
} from 'recharts';
import { getAQILevel, formatTime, POLLUTANTS_META } from '../utils/aqiHelpers';

/* ── shared tooltip style ── */
const TT_STYLE = {
  background:'rgba(6,10,22,0.97)', border:'1px solid rgba(0,212,255,0.2)',
  borderRadius:'10px', padding:'10px 14px',
  fontFamily:"'JetBrains Mono',monospace", fontSize:'11px', color:'#E2EAFF',
};

function CustomTooltip({ active, payload, label, unit }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={TT_STYLE}>
      <div style={{color:'rgba(0,212,255,0.7)',marginBottom:'4px',fontSize:'10px'}}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{color:p.color}}>{p.name}: <strong>{p.value}{unit||''}</strong></div>
      ))}
    </div>
  );
}

/* ── AQI Line Chart (48h) ── */
export function AQILineChart({ timeSeries }) {
  const [mode, setMode] = useState('us');
  if (!timeSeries?.length) return null;

  const data = timeSeries.map(t => ({
    time: formatTime(t.time),
    'US AQI': t.usAqi,
    'EU AQI': t.euAqi,
    fill: getAQILevel(t.usAqi || 0).color,
  }));

  return (
    <div style={s.chartCard}>
      <div style={s.chartHead}>
        <div>
          <div style={s.chartTitle}>AQI Trend — 48h</div>
          <div style={s.chartSub}>Past 24h + Next 24h hourly</div>
        </div>
        <div style={s.tabs}>
          {['us','eu'].map(m => (
            <button key={m} style={{...s.tab, ...(mode===m?s.tabActive:{})}} onClick={()=>setMode(m)}>
              {m === 'us' ? 'US AQI' : 'EU AQI'}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={190}>
        <LineChart data={data} margin={{top:5,right:10,bottom:0,left:0}}>
          <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3"/>
          <XAxis dataKey="time" tick={{fill:'rgba(130,160,220,0.45)',fontSize:9,fontFamily:"'JetBrains Mono',monospace"}} tickLine={false} axisLine={false} interval={5}/>
          <YAxis tick={{fill:'rgba(130,160,220,0.45)',fontSize:9,fontFamily:"'JetBrains Mono',monospace"}} tickLine={false} axisLine={false} width={30}/>
          <Tooltip content={<CustomTooltip />} />
          {/* AQI threshold lines */}
          {[50,100,150,200].map(v => (
            <ReferenceLine key={v} y={v} stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4"/>
          ))}
          <Line
            type="monotone" dataKey={mode==='us'?'US AQI':'EU AQI'}
            stroke={mode==='us'?'#00D4FF':'#7C6AFF'}
            strokeWidth={2} dot={false}
            activeDot={{r:4, fill:mode==='us'?'#00D4FF':'#7C6AFF'}}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ── Pollutant Bar Chart ── */
export function PollutantBarChart({ pollutants }) {
  const [type, setType] = useState('bar');
  if (!pollutants) return null;

  const data = POLLUTANTS_META.map(m => ({
    name: m.symbol,
    value: +(pollutants[m.key] || 0).toFixed(1),
    color: m.color,
    pct: Math.min(100, Math.round((pollutants[m.key] || 0) / m.max * 100)),
  }));

  const radarData = data.map(d => ({ subject: d.name, value: d.pct, fullMark: 100 }));

  return (
    <div style={s.chartCard}>
      <div style={s.chartHead}>
        <div>
          <div style={s.chartTitle}>Pollutant Levels</div>
          <div style={s.chartSub}>Current concentrations</div>
        </div>
        <div style={s.tabs}>
          {['bar','radar'].map(t => (
            <button key={t} style={{...s.tab,...(type===t?s.tabActive:{})}} onClick={()=>setType(t)}>
              {t.charAt(0).toUpperCase()+t.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={190}>
        {type === 'bar' ? (
          <BarChart data={data} layout="vertical" margin={{top:0,right:10,bottom:0,left:10}}>
            <CartesianGrid stroke="rgba(255,255,255,0.04)" horizontal={false}/>
            <XAxis type="number" tick={{fill:'rgba(130,160,220,0.45)',fontSize:9,fontFamily:"'JetBrains Mono',monospace"}} tickLine={false} axisLine={false}/>
            <YAxis type="category" dataKey="name" tick={{fill:'rgba(180,200,255,0.55)',fontSize:10,fontFamily:"'Orbitron',monospace"}} tickLine={false} axisLine={false} width={36}/>
            <Tooltip content={<CustomTooltip unit=" μg/m³"/>}/>
            <Bar dataKey="value" name="Concentration" radius={[0,4,4,0]}>
              {data.map((d, i) => <Cell key={i} fill={d.color+'88'} stroke={d.color} strokeWidth={1}/>)}
            </Bar>
          </BarChart>
        ) : (
          <RadarChart data={radarData} margin={{top:10,right:20,bottom:10,left:20}}>
            <PolarGrid stroke="rgba(255,255,255,0.07)"/>
            <PolarAngleAxis dataKey="subject" tick={{fill:'rgba(180,200,255,0.55)',fontSize:10,fontFamily:"'Orbitron',monospace"}}/>
            <PolarRadiusAxis angle={30} domain={[0,100]} tick={{fill:'rgba(130,160,220,0.35)',fontSize:8}} axisLine={false}/>
            <Tooltip content={<CustomTooltip unit="% of limit"/>}/>
            <Radar name="% of Limit" dataKey="value" stroke="#00D4FF" fill="#00D4FF" fillOpacity={0.12} strokeWidth={2}/>
          </RadarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}

/* ── 5-Day Forecast Chart ── */
export function ForecastBarChart({ dailyForecast }) {
  if (!dailyForecast?.length) return null;
  const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const data = dailyForecast.map(d => {
    const dt = new Date(d.date);
    return {
      day:   DAYS[dt.getDay()],
      AQI:   d.usAqi,
      PM25:  d.pm25,
      color: getAQILevel(d.usAqi||0).color,
    };
  });

  return (
    <div style={s.chartCard}>
      <div style={s.chartHead}>
        <div>
          <div style={s.chartTitle}>5-Day AQI Forecast</div>
          <div style={s.chartSub}>Daily avg AQI + PM₂.₅ trend</div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={210}>
        <BarChart data={data} margin={{top:5,right:10,bottom:0,left:0}}>
          <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3"/>
          <XAxis dataKey="day" tick={{fill:'rgba(180,200,255,0.55)',fontSize:10,fontFamily:"'JetBrains Mono',monospace"}} tickLine={false} axisLine={false}/>
          <YAxis yAxisId="left" tick={{fill:'rgba(130,160,220,0.45)',fontSize:9,fontFamily:"'JetBrains Mono',monospace"}} tickLine={false} axisLine={false} width={28}/>
          <YAxis yAxisId="right" orientation="right" tick={{fill:'rgba(255,82,82,0.5)',fontSize:9,fontFamily:"'JetBrains Mono',monospace"}} tickLine={false} axisLine={false} width={28}/>
          <Tooltip content={<CustomTooltip />} />
          <Legend iconSize={8} wrapperStyle={{fontFamily:"'JetBrains Mono',monospace",fontSize:'9px',color:'rgba(180,200,255,0.5)'}}/>
          <Bar yAxisId="left" dataKey="AQI" radius={[6,6,0,0]}>
            {data.map((d, i) => <Cell key={i} fill={d.color+'66'} stroke={d.color} strokeWidth={1}/>)}
          </Bar>
          <Line yAxisId="right" type="monotone" dataKey="PM25" stroke="#FF5252" strokeWidth={2}
            dot={{fill:'#FF5252',r:3}} name="PM₂.₅"/>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ── Pollutant Radar Full ── */
export function PollutantRadar({ pollutants }) {
  if (!pollutants) return null;
  const MAXES = { pm25:250, pm10:500, no2:340, o3:380, co:15400, so2:750, nh3:300, no:200 };
  const data = POLLUTANTS_META.map(m => ({
    subject: m.symbol,
    value: Math.min(100, Math.round((pollutants[m.key]||0) / MAXES[m.key] * 100)),
    fullMark: 100,
  }));

  return (
    <div style={s.chartCard}>
      <div style={s.chartHead}>
        <div>
          <div style={s.chartTitle}>Pollutant Radar</div>
          <div style={s.chartSub}>% of safe threshold per pollutant</div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <RadarChart data={data} margin={{top:10,right:20,bottom:10,left:20}}>
          <PolarGrid stroke="rgba(255,255,255,0.07)"/>
          <PolarAngleAxis dataKey="subject" tick={{fill:'rgba(180,200,255,0.6)',fontSize:11,fontFamily:"'Orbitron',monospace",fontWeight:600}}/>
          <PolarRadiusAxis angle={30} domain={[0,100]} tick={{fill:'rgba(130,160,220,0.3)',fontSize:7}} axisLine={false} tickCount={4}/>
          <Tooltip content={<CustomTooltip unit="% of limit"/>}/>
          <Legend iconSize={8} wrapperStyle={{fontFamily:"'JetBrains Mono',monospace",fontSize:'9px',color:'rgba(180,200,255,0.5)'}}/>
          <Radar name="% of Safe Limit" dataKey="value" stroke="#00D4FF" fill="#00D4FF" fillOpacity={0.1} strokeWidth={2}
            dot={{fill:'#00D4FF',r:3,strokeWidth:0}}/>
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

const s = {
  chartCard: {
    background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)',
    borderRadius:'18px', padding:'1.2rem 1.5rem',
  },
  chartHead: {
    display:'flex', alignItems:'flex-start', justifyContent:'space-between',
    marginBottom:'1rem',
  },
  chartTitle: {
    fontFamily:"'Orbitron',monospace", fontSize:'12px', fontWeight:600,
    letterSpacing:'0.1em', color:'#E2EAFF',
  },
  chartSub: {
    fontFamily:"'JetBrains Mono',monospace", fontSize:'9px',
    color:'rgba(130,160,220,0.4)', marginTop:'3px',
  },
  tabs: {
    display:'flex', gap:'3px',
    background:'rgba(255,255,255,0.04)', borderRadius:'6px', padding:'2px',
  },
  tab: {
    background:'none', border:'none', color:'rgba(130,160,220,0.5)',
    fontFamily:"'JetBrains Mono',monospace", fontSize:'9px',
    letterSpacing:'0.08em', padding:'4px 10px', borderRadius:'4px',
    cursor:'pointer', transition:'all 0.2s',
  },
  tabActive: { background:'#00D4FF', color:'#050B14', fontWeight:700 },
};
