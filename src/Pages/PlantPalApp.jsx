import React, { useState, useEffect } from "react";
import {
  Home,
  Droplets,
  Sprout,
  Settings,
  Activity,
  Trash2,
} from "lucide-react";

import "../Styles/PlantPalApp.css";

const PlantPalApp = () => {
  const [activeTab, setActiveTab] = useState("dashboard"); // track active page
  const [plants, setPlants] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [newSchedule, setNewSchedule] = useState({
    plantId: "",
    frequency: "daily",
    time: "",
    duration: 5,
  });

  // Fetch plants from backend
  useEffect(() => {
    fetch("http://localhost:5000/plants")
      .then((res) => res.json())
      .then((data) => setPlants(data))
      .catch((err) => console.error("❌ Error fetching plants:", err));
  }, []);

  const addSchedule = () => {
    if (newSchedule.plantId && newSchedule.time) {
      setSchedules([...schedules, { id: Date.now(), ...newSchedule }]);
      setNewSchedule({ plantId: "", frequency: "daily", time: "", duration: 5 });
    } else {
      alert("Please select a plant and set time!");
    }
  };

  // Delete schedule
  const deleteSchedule = (id) => {
    setSchedules(schedules.filter((s) => s.id !== id));
  };

  // Spray Now functionality
  const sprayNow = (scheduleId) => {
    const schedule = schedules.find((s) => s.id === scheduleId);
    if (!schedule) return;

    // Add a "lastWatered" timestamp to this schedule
    const updatedSchedules = schedules.map((s) =>
      s.id === scheduleId ? { ...s, lastWatered: new Date().toLocaleString() } : s
    );

    setSchedules(updatedSchedules);
    const plant = plants.find((p) => p._id === schedule.plantId);
    alert(`💧 Watered ${plant ? plant.name : "Unknown Plant"} at ${new Date().toLocaleTimeString()}`);
  };

  // Render different pages
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div>
            <h2>Dashboard</h2>
            <p>Welcome to PlantPal! Use the tabs to manage your plants.</p>
          </div>
        );

      case "watering":
        return (
          <div className="main-content">
            <div className="form-container">
              <h3>Add Watering Schedule</h3>
              <select
                value={newSchedule.plantId}
                onChange={(e) =>
                  setNewSchedule({ ...newSchedule, plantId: e.target.value })
                }
              >
                <option value="">Select Plant</option>
                {plants.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <select
                value={newSchedule.frequency}
                onChange={(e) =>
                  setNewSchedule({ ...newSchedule, frequency: e.target.value })
                }
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
              <input
                type="time"
                value={newSchedule.time}
                onChange={(e) =>
                  setNewSchedule({ ...newSchedule, time: e.target.value })
                }
              />
              <input
                type="number"
                min="1"
                value={newSchedule.duration}
                onChange={(e) =>
                  setNewSchedule({ ...newSchedule, duration: e.target.value })
                }
                placeholder="Duration (min)"
              />
              <button onClick={addSchedule}>Add Schedule</button>
            </div>

            <h3>Active Watering Schedules</h3>
            {schedules.length === 0 ? (
              <p>No schedules yet. Add one above 👆</p>
            ) : (
              schedules.map((s) => {
                const plant = plants.find((p) => p._id === s.plantId);
                return (
                  <div className="schedule-item" key={s.id}>
                    <div>
                      <h4>{plant ? plant.name : "Unknown Plant"}</h4>
                      <p>
                        ⏰ {s.frequency} at {s.time}
                      </p>
                      <p>💧 Duration: {s.duration} min</p>
                      {s.lastWatered && <p>🌱 Last Watered: {s.lastWatered}</p>}
                    </div>
                    <div className="schedule-actions">
                      <button className="btn-spray-now" onClick={() => sprayNow(s.id)}>
                        Spray Now
                      </button>
                      <button className="btn-delete" onClick={() => deleteSchedule(s.id)}>
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        );

      case "stats":
        return (
          <div>
            <h2>Stats</h2>
            {plants.map((p) => {
              const plantSchedules = schedules.filter((s) => s.plantId === p._id);
              const lastWatered = plantSchedules.length
                ? plantSchedules[plantSchedules.length - 1].lastWatered || "Not yet"
                : "Not yet";

              return (
                <div key={p._id} className="plant-stats-card">
                  <h4>{p.name}</h4>
                  <p>Total Schedules: {plantSchedules.length}</p>
                  <p>Last Watered: {lastWatered}</p>
                </div>
              );
            })}
          </div>
        );

      case "settings":
        return (
          <div>
            <h2>Settings</h2>
            <p>Coming soon: Manage app preferences and notifications.</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="plantpal-app">
      {/* Header */}
      <header>
        <h1>
          <Sprout size={22} /> PlantPal
        </h1>
        <nav>
          <button
            className={activeTab === "dashboard" ? "active" : ""}
            onClick={() => setActiveTab("dashboard")}
          >
            <Home size={16} /> Dashboard
          </button>
          <button
            className={activeTab === "watering" ? "active" : ""}
            onClick={() => setActiveTab("watering")}
          >
            <Droplets size={16} /> Watering
          </button>
          <button
            className={activeTab === "stats" ? "active" : ""}
            onClick={() => setActiveTab("stats")}
          >
            <Activity size={16} /> Stats
          </button>
          <button
            className={activeTab === "settings" ? "active" : ""}
            onClick={() => setActiveTab("settings")}
          >
            <Settings size={16} /> Settings
          </button>
        </nav>
      </header>

      {/* Content */}
      <div className="content">{renderContent()}</div>
    </div>
  );
};

export default PlantPalApp;
