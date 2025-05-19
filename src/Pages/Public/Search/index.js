import React, { useState } from "react";
// import { useLocation } from "react-router-dom";
import "./style.css";
import { Button, Form, Input, Select, Checkbox } from "antd";
import { DollarOutlined, HomeFilled } from "@ant-design/icons";
import { MdWhatsapp } from "react-icons/md";
import { IoLogoInstagram } from "react-icons/io5";
import RestaurantImage from "../../../Assets/restaurant-display-img.png";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../Components/Navbar/index";


const dummyData = Array(4).fill({
    name: "Villa – The Great Buffet",
    location: "Lake City",
    contact: "0304 1110852",
    instagram: "TheVilla",
    address:
        "Plot No.C43-25, Canal Commercial, Street 44, Canal Commercial, Block M 3 A Lake City, Lahore, 54000",
    rating: "4.9",
    reviews: "1920",
    tags: ["#SpecialOffer", "#Popular"],
});

const SearchResults = () => {
    const [searchText, setSearchText] = useState("Searched Text");
    const navigate = useNavigate();

    return (
        <div className="search">
            <Navbar title="Search Results" />
            <hr />
            <div className="header">
                <div className="text-container">
                    <p className="message">
                        20 filtered results for: Lahore, Continental, 2 Guests
                    </p>
                    <p className="search-text">'{searchText}'</p>
                </div>
                <Input.Search
                    placeholder="Search for Restaurants"
                    className="searchBar"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onSearch={(val) => console.log("Search:", val)}
                />
            </div>
            <hr />
            <div className="main-body">
                <div className="filters">
                    <p className="filter-heading">Filters</p>
                    <Form layout="vertical">
                        <Form.Item label="Location">
                            <Input placeholder="e.g. Lahore" />
                        </Form.Item>
                        <Form.Item label="Service">
                            <Input placeholder="e.g. High Tea" />
                        </Form.Item>
                        <Form.Item label="Minimum Price" name="min_price">
                            <Input type="number" prefix={<DollarOutlined />} />
                        </Form.Item>
                        <Form.Item label="Maximum Price" name="max_price">
                            <Input type="number" prefix={<DollarOutlined />} />
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
                        options={["item01", "item01", "item01", "item01"]}
                        defaultValue={["item01"]}
                        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
                    />
                    <hr />
                    <p className="filter-heading">Customer Ratings</p>
                    <Checkbox.Group
                        options={["item01", "item01", "item01", "item01"]}
                        defaultValue={["item01"]}
                        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
                    />
                </div>

                <div className="list">
                    <div className="sort">
                        <Select
                            defaultValue="Sort By"
                            options={[
                                { label: "Highest Rated", value: "rated" },
                                { label: "Most Reviewed", value: "reviews" },
                            ]}
                            style={{ width: 150 }}
                        />
                    </div>
                    <div className="list-items">
                        {dummyData.map((item, index) => (
                            <div className="item-card" key={index}>
                                <img src={RestaurantImage} alt="Restaurant" />
                                <div className="body-container">
                                    <div className="name-container">
                                        <div>
                                            <p className="heading">{item.name}</p>
                                            <p className="item-text zero-margin">{item.location}</p>
                                        </div>
                                        <div className="name-container">
                                            <div>
                                                <p className="subheading zero-margin">Highly Rated</p>
                                                <p className="item-text zero-margin">{item.reviews} Reviews</p>
                                            </div>
                                            <div className="rating">{item.rating}</div>
                                        </div>
                                    </div>

                                    <div className="shop-info zero-margin">
                                        <MdWhatsapp color="green" className="social-icon" />
                                        <span>{item.contact}</span>
                                    </div>
                                    <div className="shop-info">
                                        <IoLogoInstagram color="purple" className="social-icon" />
                                        <span>@{item.instagram}</span>
                                    </div>

                                    <div className="values zero-margin">
                                        <HomeFilled />
                                        <p className="item-text zero-margin">{item.address}</p>
                                    </div>

                                    <div className="name-container">
                                        <div>
                                            <p className="subheading">Services Offered</p>
                                            <div className="services">
                                                {item.tags.map((tag, i) => (
                                                    <div className="service" key={i}>
                                                        <p className="item-text zero-margin">{tag}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <Button
                                            className="service-button"
                                            onClick={() => navigate(`/restaurant/${index + 1}`)}
                                        >
                                            See Services
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};


export default SearchResults;