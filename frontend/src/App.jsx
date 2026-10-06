import React, { useCallback } from 'react';
import Header        from './components/Header';
import SearchBar     from './components/SearchBar';
import WelcomeScreen from './components/WelcomeScreen';
import Dashboard     from './components/Dashboard';
import LoadingScreen from './components/LoadingScreen';
import { useAirQuality } from './hooks/useAirQuality';

export default function App() {
  const { data, loading, error, load } = useAirQuality();
  const handleCitySelect = useCallback((city) => {
    load(city.latitude, city.longitude, city.name, city.country);
  }, [load]);

  return (
    <div style={styles.root}>
      {/* Animated background */}
      <div style={styles.bgOrb1} />
      <div style={styles.bgOrb2} />
      <div style={styles.bgOrb3} />
      <div style={styles.bgGrid} />

      <div style={styles.app}>
        <Header />
        <SearchBar onCitySelect={handleCitySelect} />

        {error && (
          <div style={styles.errorBox}>
            <span>⚠</span>
            <span>{error}</span>
          </div>
        )}

        {loading && <LoadingScreen />}

        {!loading && !data && !error && (
          <WelcomeScreen onCitySelect={handleCitySelect} />
        )}

        {!loading && data && (
          <Dashboard data={data} />
        )}
      </div>
    </div>
  );
}

const styles = {
  root: {
    minHeight: '100vh',
    background: '#050B14',
    position: 'relative',
    overflow: 'hidden',
  },
  bgOrb1: {
    position: 'fixed', top: '-200px', right: '-100px',
    width: '600px', height: '600px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)',
    pointerEvents: 'none', zIndex: 0,
    animation: 'float1 14s ease-in-out infinite',
  },
  bgOrb2: {
    position: 'fixed', bottom: '-150px', left: '-80px',
    width: '500px', height: '500px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(108,99,255,0.05) 0%, transparent 70%)',
    pointerEvents: 'none', zIndex: 0,
  },
  bgOrb3: {
    position: 'fixed', top: '40%', left: '35%',
    width: '350px', height: '350px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(0,184,169,0.03) 0%, transparent 70%)',
    pointerEvents: 'none', zIndex: 0,
  },
  bgGrid: {
    position: 'fixed', inset: 0,
    backgroundImage: 'radial-gradient(rgba(0,212,255,0.06) 1px, transparent 1px)',
    backgroundSize: '30px 30px',
    pointerEvents: 'none', zIndex: 0,
  },
  app: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1.5rem 5rem',
    position: 'relative', zIndex: 1,
  },
  errorBox: {
    display: 'flex', alignItems: 'center', gap: '10px',
    background: 'rgba(244,67,54,0.08)',
    border: '1px solid rgba(244,67,54,0.25)',
    borderRadius: '10px', padding: '12px 18px',
    color: '#FF7070', fontSize: '13px',
    marginBottom: '1rem',
    animation: 'fadeIn 0.3s ease',
  },
};
