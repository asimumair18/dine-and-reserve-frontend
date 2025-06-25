import React, { useState } from "react";
import "./style.css";
import RestaurantGrid from "./RestaurantGrid";
import { Input, Select, Button } from "antd";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../Components/Navbar";
import Footer from "../../../Components/Footer";

const { Search } = Input;

const Discover = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("");
  const [sortBy, setSortBy] = useState("");

  const handleSearch = (value) => {
    navigate(`/search?q=${encodeURIComponent(value)}`);
  };

  const handleClear = () => {
    setFilter("");
    setSortBy("");
  };

  return (
    <div className="discover">
      <Navbar title="Discover" />
      <hr />

      <div className="heading">
        <p>Discover Restaurants</p>
        <Search
          placeholder="Search for Restaurants"
          className="searchBar"
          onSearch={handleSearch}
        />
      </div>

      <hr className="styled-separator" />

      <div className="body-container">
        <div className="filter-options">
          <Select
            value={filter || "none"}
            style={{ width: 200 }}
            onChange={(val) => setFilter(val === "none" ? "" : val)}
            options={[
              { value: "none", label: "All Types" },
              { value: "high-tea", label: "High-Tea" },
              { value: "buffet", label: "Buffet" },
            ]}
          />
          <Select
            value={sortBy || "none"}
            style={{ width: 150 }}
            onChange={(val) => setSortBy(val === "none" ? "" : val)}
            options={[
              { value: "none", label: "Default" },
              { value: "rating", label: "Most Popular" },
            ]}
          />
        </div>

        <div className="restaurants-wrapper">
          <RestaurantGrid filter={filter} sortBy={sortBy} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Discover;
