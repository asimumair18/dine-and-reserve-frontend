import React, { useEffect, useState } from "react";
import "./style.css";
import {
    Button,
    Form,
    Input,
    Select,
    Checkbox,
} from "antd";
import { DollarOutlined, HomeFilled } from "@ant-design/icons";
import { MdWhatsapp } from "react-icons/md";
import { IoLogoInstagram } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../../Components/Navbar/index";

const SearchResults = () => {
    const location = useLocation();
    const navigate = useNavigate();


    const [searchText, setSearchText] = useState("");
    const [restaurants, setRestaurants] = useState([]);
    const [service, setService] = useState("");
    const [sortBy, setSortBy] = useState("");
    const [locFilter, setLocFilter] = useState("");

    const fetchResults = async () => {
        const params = new URLSearchParams({
            keyword: searchText,
            location: locFilter,
            service,
            sort: sortBy,
        });

        try {
            const res = await fetch(`/api/restaurants/search?${params}`);
            const data = await res.json();
            setRestaurants(data);
        } catch (err) {
            console.error("Failed to fetch search results:", err);
        }
    };

    useEffect(() => {
        if (searchText) fetchResults();
    }, [searchText, service, sortBy, locFilter]);

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const urlSearch = query.get("q") || "";

        // Use URL param if exists, otherwise localStorage
        const initialSearch = urlSearch || localStorage.getItem("lastSearch") || "";
        setSearchText(initialSearch);

        if (urlSearch) {
            localStorage.setItem("lastSearch", urlSearch);
        }
    }, [location.search]);

    const handleSearch = (val) => {
        // Update URL when searching
        navigate(`/search?q=${encodeURIComponent(val)}`, { replace: true });
        setSearchText(val);
        localStorage.setItem("lastSearch", val);
    };

    const getRatingTag = (rating) => {
        if (!rating || rating === 0) return "Not Rated";
        if (rating < 3) return "Poorly Rated";
        if (rating <= 4.5) return "Well Rated";
        return "Highly Rated";
    };

    return (
        <div className="search">
            <Navbar title="Search Results" />
            <hr />
            <div className="header">
                <div className="text-container">
                    <p className="message">Filtered search results</p>
                    <p className="search-text">'{searchText}'</p>
                </div>
                <Input.Search
                    placeholder="Search for Restaurants"
                    className="searchBar"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onSearch={handleSearch}
                />
            </div>
            <hr />
            <div className="main-body">
                <div className="filters">
                    <p className="filter-heading">Filters</p>
                    <Form layout="vertical" onFinish={fetchResults}>
                        <Form.Item label="Location">
                            <Input
                                placeholder="e.g. Lahore"
                                value={locFilter}
                                onChange={(e) => setLocFilter(e.target.value)}
                            />
                        </Form.Item>
                        <Form.Item label="Service">
                            <Select
                                placeholder="e.g. High Tea"
                                value={service || undefined}
                                onChange={(val) => setService(val)}
                                allowClear
                                options={[
                                    { value: "high-tea", label: "High-Tea" },
                                    { value: "buffet", label: "Buffet" },
                                ]}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button htmlType="submit" className="submit-button">
                                Search
                            </Button>
                        </Form.Item>
                    </Form>

                    <hr />
                    <p className="filter-heading">Popular Filters</p>
                    <Checkbox.Group
                        options={["Fast Service", "Outdoor Seating"]}
                        defaultValue={[]}
                        disabled
                    />
                    <hr />
                    <p className="filter-heading">Customer Ratings</p>
                    <Checkbox.Group
                        options={["4+ stars", "3+ stars"]}
                        defaultValue={[]}
                        disabled
                    />
                </div>

                <div className="list">
                    <div className="sort">
                        <Select
                            defaultValue="Sort By"
                            onChange={(val) => setSortBy(val)}
                            options={[
                                { label: "Highest Rated", value: "rating" },
                                { label: "Most Reviewed", value: "reviewCount" },
                            ]}
                            style={{ width: 150 }}
                        />
                    </div>

                    <div className="list-items">
                        {restaurants.map((item, index) => (
                            <div className="item-card" key={item._id || index}>
                                <img
                                    src={
                                        item.displayImages?.[0]
                                            ? item.displayImages[0].startsWith("/uploads/")
                                                ? item.displayImages[0]
                                                : `/uploads/${item.displayImages[0]}`
                                            : "/fallback.jpg"
                                    }
                                    alt="Restaurant"
                                />
                                <div className="body-container">
                                    <div className="name-container">
                                        <div>
                                            <p className="heading">{item.fullName}</p>
                                            <p className="item-text zero-margin">{item.description || "No Description Added"}</p>
                                        </div>
                                        <div className="name-container">
                                            <div>
                                                <p className="subheading zero-margin">
                                                    {getRatingTag(item.averageRating)}
                                                </p>
                                                <p className="item-text zero-margin">
                                                    {item.reviewCount || 0} Reviews
                                                </p>
                                            </div>
                                            <div className="rating">
                                                {item.averageRating && item.averageRating > 0
                                                    ? item.averageRating.toFixed(1)
                                                    : "Not Rated"}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="shop-info combined-line">
                                        <MdWhatsapp color="green" className="social-icon" />
                                        <span>{item.phone ? `+${item.phone}` : "Contact Info Not Shown"}</span>
                                        <IoLogoInstagram color="purple" className="social-icon" style={{ marginLeft: "20px" }} />
                                        <span>@{item.instagram || "Instagram Not Added"}</span>
                                    </div>

                                    <div className="values zero-margin">
                                        <HomeFilled />
                                        <p className="item-text zero-margin">{item.restaurantAddress}</p>
                                    </div>

                                    <div className="name-container">
                                        <div>
                                            <p className="subheading">Services Offered</p>
                                            <div className="services">
                                                {item.perks && item.perks.length > 0 ? (
                                                    item.perks.map((perk, i) => (
                                                        <div className="service" key={i}>
                                                            <p className="item-text zero-margin">#{perk}</p>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="item-text zero-margin">None</p>
                                                )}
                                            </div>
                                        </div>
                                        <Button
                                            className="service-button"
                                            onClick={() => navigate(`/restaurant/${item._id}`)}
                                        >
                                            See Services
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {restaurants.length === 0 && (
                            <p className="empty-text">No matching restaurants found.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchResults;
