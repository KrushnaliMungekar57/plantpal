import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "../Styles/Plantlib.css";

const Plantlib = () => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [careFilter, setCareFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  // New plant form state
  const [newPlant, setNewPlant] = useState({
    name: "",
    care: "",
    type: "",
    description: "",
    imageUrl: ""
  });

  // Fetch all plants from backend
  useEffect(() => {
    fetch("http://localhost:5000/plants")
      .then((res) => res.json())
      .then((data) => {
        setPlants(data);
        setLoading(false);
      })
      .catch((err) => console.error("❌ Error fetching plants:", err));
  }, []);

  // Add new plant to DB
  const handleAddPlant = async (e) => {
    e.preventDefault();

    if (!newPlant.imageUrl) {
      newPlant.imageUrl = "https://via.placeholder.com/150"; // default image
    }

    try {
      const res = await fetch("http://localhost:5000/plants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPlant),
      });

      const savedPlant = await res.json();

      // update frontend list
      setPlants((prev) => [...prev, savedPlant]);

      // reset form
      setNewPlant({ name: "", care: "", type: "", description: "", imageUrl: "" });
    } catch (err) {
      console.error("❌ Error adding plant:", err);
    }
  };

  // Apply search + filter
  const filteredPlants = plants.filter(
    (plant) =>
      plant.name?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (careFilter ? plant.care === careFilter : true) &&
      (typeFilter ? plant.type === typeFilter : true)
  );

  if (loading) return <p>🌿 Loading plants...</p>;

  return (
    <div className="plant-lib-container">
      {/* Navbar */}
      <nav className="navbar-lib">
        <div className="navbar-left">
          <img src="/Main.png" alt="PlantPal Logo" className="logo" />
        </div>
        <ul className="nav-links-lib">
          <li><NavLink to="/home">Home</NavLink></li>
          <li><NavLink to="/plantlib" className="active">Plant Library</NavLink></li>
          <li><NavLink to="/features">Features</NavLink></li>
          <li><NavLink to="/plantpalapp">Dashboard</NavLink></li>
          <li><NavLink to="/urbangrow">UrbanGrow</NavLink></li>
        </ul>
      </nav>

      {/* Add Plant Form */}
      <div className="add-plant-form">
        <h2>➕ Add a New Plant</h2>
        <form onSubmit={handleAddPlant}>
          <input
            type="text"
            placeholder="Name"
            value={newPlant.name}
            onChange={(e) => setNewPlant({ ...newPlant, name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Care (Easy, Medium, Hard)"
            value={newPlant.care}
            onChange={(e) => setNewPlant({ ...newPlant, care: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Type (Foliage, Flowering, etc.)"
            value={newPlant.type}
            onChange={(e) => setNewPlant({ ...newPlant, type: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Image URL (optional)"
            value={newPlant.imageUrl}
            onChange={(e) => setNewPlant({ ...newPlant, imageUrl: e.target.value })}
          />
          <textarea
            placeholder="Description"
            value={newPlant.description}
            onChange={(e) =>
              setNewPlant({ ...newPlant, description: e.target.value })
            }
          />
          <button type="submit">Add Plant</button>
        </form>
      </div>

      {/* Search & Filter */}
      <div className="filter-and-search-container">
        <input
          type="text"
          placeholder="Search plants..."
          className="search-input-lib"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="filters-wrapper">
          <div className="filter-group">
            <button onClick={() => setCareFilter("")}>All</button>
            <button onClick={() => setCareFilter("Easy")}>Easy</button>
            <button onClick={() => setCareFilter("Medium")}>Medium</button>
            <button onClick={() => setCareFilter("Hard")}>Hard</button>
          </div>

          <div className="filter-group">
            <button onClick={() => setTypeFilter("")}>All</button>
            <button onClick={() => setTypeFilter("Foliage")}>Foliage</button>
            <button onClick={() => setTypeFilter("Flowering")}>Flowering</button>
            <button onClick={() => setTypeFilter("Medicinal")}>Medicinal</button>
            <button onClick={() => setTypeFilter("Vegetable")}>Vegetable</button>
          </div>
        </div>
      </div>

      {/* Plant Cards */}
      <div className="plant-card-grid">
        {filteredPlants.length === 0 ? (
          <p>No plants found 😢</p>
        ) : (
          filteredPlants.map((plant) => (
            <div key={plant._id} className="plant-card">
              <div className="plant-image-container">
                <img
                  src={plant.imageUrl || "https://via.placeholder.com/150"}
                  alt={plant.name}
                  className="plant-image"
                  onError={(e) => { e.target.src = "https://via.placeholder.com/150"; }}
                />
              </div>
              <div className="plant-details">
                <h3>{plant.name}</h3>
                <span className={`plant-care plant-care-${plant.care?.toLowerCase()}`}>
                  {plant.care} Care
                </span>
                <p>{plant.description}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Plantlib;