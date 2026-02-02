import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { DEMO_MODE, DEFAULT_CONFIG } from './constants';
import { apiFetch } from './services/api';
import Dashboard from './components/Dashboard';
import ParkInterface from './components/ParkInterface';
import AdminPanel from './components/AdminPanel';
import SuccessView from './components/SuccessView';
import Toast from './components/Toast';

const App = () => {
  const [view, setView] = useState('dashboard');
  const [activeCarId, setActiveCarId] = useState(null);
  // Initialize from localStorage for instant render
  const [config, setConfig] = useState(() => {
    const saved = localStorage.getItem('pt_config');
    return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
  });

  const [parkingStatus, setParkingStatus] = useState({});
  const [currentUser, setCurrentUser] = useState('');
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    // Capture Key & ID from URL immediately
    const params = new URLSearchParams(window.location.search);
    const urlKey = params.get('key');
    const userParam = params.get('user');
    const storedUser = localStorage.getItem('pt_user');

    if (urlKey) {
      localStorage.setItem('pt_api_key', urlKey);
    }

    if (userParam) {
      setCurrentUser(userParam);
      localStorage.setItem('pt_user', userParam);
    } else if (storedUser) {
      setCurrentUser(storedUser);
    } else {
      setCurrentUser('Driver');
    }

    // Load Data
    loadData();

    // Auto-refresh every 2 seconds for live updates
    const intervalId = setInterval(() => loadData(true), 2000);

    const carIdParam = params.get('car');
    if (carIdParam) handleStartParking(carIdParam);

    return () => clearInterval(intervalId);
  }, []);

  // Track Auth Failures
  const authFailCount = React.useRef(0);

  const loadData = async (isBackground = false) => {
    if (!isBackground) setLoading(true);

    if (DEMO_MODE) {

      const savedConfig = localStorage.getItem('pt_config');
      const savedStatus = localStorage.getItem('pt_status');

      if (savedConfig) setConfig(JSON.parse(savedConfig));
      if (savedStatus) setParkingStatus(JSON.parse(savedStatus));
    } else {
      // Prevent server requests if no API key is present
      const hasKey = !!localStorage.getItem('pt_api_key');
      if (!hasKey) {
        if (!isBackground) setLoading(false);
        // console.log("Skipping loadData - No API Key");
        return;
      }

      try {
        // Fetch config and status in parallel
        const [configRes, statusRes] = await Promise.all([
          apiFetch('/api/config'),
          apiFetch('/api/status')
        ]);

        const newConfig = await configRes.json();
        const newStatus = await statusRes.json();

        setConfig(newConfig);
        setParkingStatus(newStatus);

        // Reset fail count on success
        authFailCount.current = 0;

        localStorage.setItem('pt_config', JSON.stringify(newConfig));
      } catch (err) {
        console.error("Failed to load data", err);

        // Handle 403 Revocation with Retry
        if (err.status === 403) {
          authFailCount.current += 1;
          console.warn(`Auth failure ${authFailCount.current}/3`);

          if (authFailCount.current >= 3) {
            console.warn("Access Revoked: Clearing session");
            // Clear ALL Auth & Data Persistence
            localStorage.removeItem('pt_api_key');
            localStorage.removeItem('pt_config');
            localStorage.removeItem('pt_status');
            localStorage.removeItem('pt_user');

            setConfig(DEFAULT_CONFIG); // Reset to empty/default
            setParkingStatus({});
            setView('dashboard'); // Force exit from other views
            showNotification("Session Expired: Access Revoked");
            authFailCount.current = 0;
          }
        }
      }
    }
    if (!isBackground) setLoading(false);
  };



  const saveConfig = async (newConfig) => {
    setConfig(newConfig);
    if (DEMO_MODE) {
      localStorage.setItem('pt_config', JSON.stringify(newConfig));

    } else {
      await apiFetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newConfig)
      });
    }
  };

  const saveUserIdentity = (name) => {
    setCurrentUser(name);
    localStorage.setItem('pt_user', name);
  };

  const updateParking = async (carId, floor, section) => {
    const timestamp = Date.now();
    const location = `${floor}${section}`;
    const user = currentUser || "Unknown";

    const newStatus = { ...parkingStatus, [carId]: { location, timestamp, user } };
    setParkingStatus(newStatus);

    if (DEMO_MODE) {
      localStorage.setItem('pt_status', JSON.stringify(newStatus));
    } else {
      await apiFetch('/api/park', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ carId, location, timestamp, user })
      });
    }

    setView('success');
    setTimeout(() => {
      setView('dashboard');
      // Clear URL params to avoid re-triggering actions on refresh
      try {
        window.history.pushState({}, document.title, window.location.pathname);
      } catch (e) {
        // Ignore history errors
      }
    }, 1000);
  };

  const handleStartParking = (carId) => {
    setActiveCarId(carId);
    setView('park');
  };

  const showNotification = (msg) => {
    setToastMsg(msg);
  };



  if (loading && !config) {
    return <div className="h-full flex items-center justify-center text-slate-400">Loading...</div>;
  }

  return (
    <div className="h-[100dvh] w-screen bg-slate-50 overflow-hidden overscroll-none font-sans text-slate-900 select-none fixed inset-0">
      <div className="mx-auto max-w-md h-full bg-white shadow-2xl overflow-hidden relative">
        <AnimatePresence mode="wait">
          {view === 'dashboard' && (
            <Dashboard
              key="dashboard"
              config={config}
              parkingStatus={parkingStatus}
              handleStartParking={handleStartParking}
              currentUser={currentUser}
              setView={setView}
              loading={loading}
            />
          )}

          {view === 'park' && (
            <ParkInterface
              key="park"
              config={config}
              activeCarId={activeCarId}
              updateParking={updateParking}
              setView={setView}
              currentUser={currentUser}
            />
          )}

          {view === 'admin' && (
            <AdminPanel
              key="admin"
              config={config}
              saveConfig={saveConfig}
              currentUser={currentUser}
              saveUserIdentity={saveUserIdentity}
              setView={setView}
              showNotification={showNotification}
            />
          )}

          {view === 'success' && <SuccessView key="success" />}
        </AnimatePresence>

        <Toast message={toastMsg} onClose={() => setToastMsg('')} />
      </div>
    </div>
  );
};

export default App;