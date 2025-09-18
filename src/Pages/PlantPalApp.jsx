import React, { useState, useEffect } from 'react';
import { NavLink } from "react-router-dom";
import '../styles/PlantPalApp.css';

import { 
  Home, 
  Droplets, 
  Sprout, 
  Settings, 
  Activity,
  Play,
  Pause,
  Trash2,
  Clock,
  Thermometer,
  Cloud
} from 'lucide-react';

const PlantPalApp = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [plants, setPlants] = useState([]);
  const [wateringSchedules, setWateringSchedules] = useState([]);
  const [pestControlSchedules, setPestControlSchedules] = useState([]);
  const [systemStatus, setSystemStatus] = useState({
    waterPump: 'online',
    pestSpray: 'online',
    sensors: 'online',
    connectivity: 'connected'
  });

  // Fetch plants
  useEffect(() => {
    fetch("http://localhost:5000/plants")
      .then(res => res.json())
      .then(data => setPlants(data))
      .catch(err => console.error("❌ Error fetching plants:", err));
  }, []);

  // System status refresh
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStatus(prev => ({ ...prev, lastUpdate: new Date().toISOString() }));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // --- Sidebar navigation ---
  const Navigation = () => (
    <div className="sidebar-container">
      <h1 className="sidebar-title">
        <Sprout className="icon" />
        PlantPal
      </h1>
      <nav className="nav-links">
        {[ 
          { id: 'dashboard', label: 'Dashboard', icon: Home },
          { id: 'watering', label: 'Smart Watering', icon: Droplets },
          { id: 'pestcontrol', label: 'Pest Control', icon: Sprout },
          { id: 'plants', label: 'Plant Library', icon: Activity },
          { id: 'settings', label: 'Settings', icon: Settings }
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setCurrentPage(id)}
            className={`nav-button ${currentPage === id ? 'active' : ''}`}
          >
            <Icon className="nav-icon" />
            {label}
          </button>
        ))}
      </nav>
    </div>
  );

  // --- Dashboard ---
  const Dashboard = () => (
    <div className="dashboard">
      <h2 className="dashboard-title">Dashboard</h2>
      <div className="system-status-grid">
        {Object.entries(systemStatus).map(([key, status]) => (
          <div key={key} className="status-card">
            <div className="status-header">
              <h3 className="status-title">{key.replace(/([A-Z])/g, ' $1')}</h3>
              <span className={`status-indicator ${status}`}></span>
            </div>
            <p className="status-text">{status}</p>
          </div>
        ))}
      </div>

      <div className="plants-grid">
        {plants.map(plant => {
          // Get the next enabled watering schedule for this plant
          const nextWater = wateringSchedules
            .filter(s => s.enabled && s.plantId === plant._id.toString())
            .sort((a,b) => new Date(a.nextWatering) - new Date(b.nextWatering))[0];

          const nextSpray = pestControlSchedules
            .filter(s => s.enabled && s.plantId === plant._id.toString())
            .sort((a,b) => new Date(a.nextSpray) - new Date(b.nextSpray))[0];

          return (
            <div key={plant._id} className="plant-card">
              <div className="plant-card-header">
                <h3 className="plant-name">{plant.name}</h3>
                <span className={`plant-status ${plant.status || 'healthy'}`}>
                  {plant.status?.replace('_',' ') || 'Healthy'}
                </span>
              </div>
              <div className="plant-stats">
                <div className="plant-stat">
                  <Droplets className="plant-icon" />
                  <span>Soil Moisture: {plant.soilMoisture ?? '-'}</span>
                </div>
                <div className="plant-stat">
                  <Thermometer className="plant-icon" />
                  <span>Temperature: {plant.temperature ?? '-'}°C</span>
                </div>
                <div className="plant-stat">
                  <Cloud className="plant-icon" />
                  <span>Humidity: {plant.humidity ?? '-'}%</span>
                </div>
                <div className="plant-stat">
                  <Clock className="plant-icon" />
                  <span>
                    Next Watering: {nextWater ? new Date(nextWater.nextWatering).toLocaleString() : 'N/A'}
                  </span>
                </div>
              </div>
              <div className="plant-card-actions">
                {nextWater && (
                  <button className="btn-water" onClick={() => {
                    const now = new Date().toISOString();
                    setWateringSchedules(prev =>
                      prev.map(s => s.id === nextWater.id ? { ...s, nextWatering: now } : s)
                    );
                  }}>Water Now</button>
                )}
                {nextSpray && (
                  <button className="btn-spray" onClick={() => {
                    const now = new Date().toISOString();
                    setPestControlSchedules(prev =>
                      prev.map(s => s.id === nextSpray.id ? { ...s, nextSpray: now } : s)
                    );
                  }}>Spray Now</button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

// --- Pest Control ---
  const WaterControl = () => {
    const [newSpraySchedule, setNewSpraySchedule] = useState({ plantId: '', frequency: 'weekly' });

    const addWaterSchedule = () => {
      if(newWaterSchedule.plantId){
        const schedule = { 
          id: Date.now(),
          ...newWaterSchedule, 
          plantId: newWaterSchedule.plantId.toString(),
          enabled: true, 
          nextWater: new Date().toISOString() 
        };
        setWaterControlSchedules(prev => [...prev, schedule]);
        setNewWaterSchedule({ plantId: '', frequency: 'weekly'});
      }
    };

    const deleteWaterSchedule = (id) => {
      setWaterControlSchedules(prev => prev.filter(s => s.id !== id));
    };

    const waterNow = (id) => {
      const now = new Date().toISOString();
      setWaterControlSchedules(prev => prev.map(s => s.id === id ? { ...s, nextSpray: now } : s));
    };

    return (
      <div className="water-control">
        <h2 className="page-title">Watering System</h2>
        <div className="add-water">
          <h3 className="section-title">Add Watering Schedule</h3>
          <div className="add-water-form">
            <select value={newWaterSchedule.plantId} onChange={e => setNewWaterSchedule({...newWaterSchedule, plantId: e.target.value})}>
              <option value="">Select Plant</option>
              {plants.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
            </select>
            <select value={newWaterSchedule.frequency} onChange={e => setNewWaterSchedule({...newWaterSchedule, frequency: e.target.value})}>
              <option value="weekly">Weekly</option>
              <option value="biweekly">Bi-weekly</option>
              <option value="monthly">Monthly</option>
            </select>
           
            <button className="btn-add" onClick={addWaterSchedule}>Add Schedule</button>
          </div>
        </div>

        <div className="current-water-schedules">
          <h3 className="section-title">Active Water Schedules</h3>
          {ControlSchedules.map(s => {
            const plant = plants.find(p => p._id.toString() === s.plantId);
            return (
              <div key={s.id} className="schedule-item">
                <div>
                  <h4 className="schedule-plant">{plant?.name}</h4>
                  <p>{s.frequency} with {s.pesticide}</p>
                  <p>Next water: {new Date(s.nextWater).toLocaleString()}</p>
                </div>
                <div className="schedule-actions">
                  <button className="btn-spray-now" onClick={() => sprayNow(s.id)}>Water Now</button>
                  <button className="btn-delete" onClick={() => deleteWaterSchedule(s.id)}><Trash2 /></button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    );
  };


  // --- Pest Control ---
  const PestControl = () => {
    const [newSpraySchedule, setNewSpraySchedule] = useState({ plantId: '', frequency: 'weekly', pesticide: 'Organic Neem Oil' });

    const addSpraySchedule = () => {
      if(newSpraySchedule.plantId){
        const schedule = { 
          id: Date.now(),
          ...newSpraySchedule, 
          plantId: newSpraySchedule.plantId.toString(),
          enabled: true, 
          nextSpray: new Date().toISOString() 
        };
        setPestControlSchedules(prev => [...prev, schedule]);
        setNewSpraySchedule({ plantId: '', frequency: 'weekly', pesticide: 'Organic Neem Oil' });
      }
    };

    const deleteSpraySchedule = (id) => {
      setPestControlSchedules(prev => prev.filter(s => s.id !== id));
    };

    const sprayNow = (id) => {
      const now = new Date().toISOString();
      setPestControlSchedules(prev => prev.map(s => s.id === id ? { ...s, nextSpray: now } : s));
    };

    return (
      <div className="pest-control">
        <h2 className="page-title">Pest Control System</h2>
        <div className="add-spray">
          <h3 className="section-title">Add Spray Schedule</h3>
          <div className="add-spray-form">
            <select value={newSpraySchedule.plantId} onChange={e => setNewSpraySchedule({...newSpraySchedule, plantId: e.target.value})}>
              <option value="">Select Plant</option>
              {plants.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
            </select>
            <select value={newSpraySchedule.frequency} onChange={e => setNewSpraySchedule({...newSpraySchedule, frequency: e.target.value})}>
              <option value="weekly">Weekly</option>
              <option value="biweekly">Bi-weekly</option>
              <option value="monthly">Monthly</option>
            </select>
            <select value={newSpraySchedule.pesticide} onChange={e => setNewSpraySchedule({...newSpraySchedule, pesticide: e.target.value})}>
              <option value="Organic Neem Oil">Organic Neem Oil</option>
              <option value="Insecticidal Soap">Insecticidal Soap</option>
              <option value="Diatomaceous Earth">Diatomaceous Earth</option>
            </select>
            <button className="btn-add" onClick={addSpraySchedule}>Add Schedule</button>
          </div>
        </div>

        <div className="current-spray-schedules">
          <h3 className="section-title">Active Spray Schedules</h3>
          {pestControlSchedules.map(s => {
            const plant = plants.find(p => p._id.toString() === s.plantId);
            return (
              <div key={s.id} className="schedule-item">
                <div>
                  <h4 className="schedule-plant">{plant?.name}</h4>
                  <p>{s.frequency} with {s.pesticide}</p>
                  <p>Next spray: {new Date(s.nextSpray).toLocaleString()}</p>
                </div>
                <div className="schedule-actions">
                  <button className="btn-spray-now" onClick={() => sprayNow(s.id)}>Spray Now</button>
                  <button className="btn-delete" onClick={() => deleteSpraySchedule(s.id)}><Trash2 /></button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    );
  };

  // --- Plant Library ---
  const PlantLibrary = () => (
    <div className="plant-library">
      <h2 className="page-title">Plant Library</h2>
      <div className="plant-library-grid">
        {plants.map((plant, index) => (
          <div key={index} className="plant-card">
            <h3 className="plant-name">{plant.name}</h3>
            <div className="plant-details">
              <div className="plant-detail">
                <Droplets className="plant-icon" />
                <span>Care: {plant.care}</span>
              </div>
              <div className="plant-detail">
                <Sprout className="plant-icon" />
                <span>Type: {plant.type}</span>
              </div>
              <p>{plant.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const SettingsPage = () => (
    <div className="settings-page">
      <h2 className="page-title">Settings</h2>
    </div>
  );

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'watering': return <WateringSystem />;
      case 'pestcontrol': return <PestControl />;
      case 'plants': return <PlantLibrary />;
      case 'settings': return <SettingsPage />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="plantpal-app">
      <div className="sidebar">
        <Navigation />
      </div>
      <div className="main-content">
        {renderCurrentPage()}
      </div>
    </div>
  );
};

export default PlantPalApp;
