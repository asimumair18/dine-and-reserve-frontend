import React from "react";
import "./style.css";
import RestaurantGrid from "./RestaurantGrid";
import { Input, Select } from "antd";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../Components/Navbar";


const { Search } = Input;

const Discover = () => {

  const navigate = useNavigate();
  const handleSearch = (value) => {
    navigate("/search", { state: { keyword: value } });
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
            defaultValue="Filters (Note: With A Checkbox Item List)"
            style={{ width: 300 }}
            options={[
              { value: "veg", label: "Vegetarian" },
              { value: "nonveg", label: "Non-Vegetarian" },
            ]}
          />
          <Select
            defaultValue="Sort By"
            style={{ width: 150 }}
            options={[
              { value: "popular", label: "Most Popular" },
              { value: "rating", label: "Highest Rated" },
            ]}
          />
        </div>
        <div className="restaurants-wrapper">
          <RestaurantGrid restaurants={[]} isLoading={false} />
        </div>
      </div>
    </div>
  );
};

export default Discover;