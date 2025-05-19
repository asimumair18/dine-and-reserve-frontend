import {
  Button,
  Progress,
  Tabs,
  ConfigProvider,
  Popconfirm,
  message,
  Image,
} from "antd";
import React, { useState, useEffect } from "react";
import Footer from "../../../Components/Footer";
import Navbar from "../../../Components/Navbar";
import ReviewModal from "../../../Components/Common/ReviewModal";
import "./style.css";
import { DeleteOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { MdWhatsapp } from "react-icons/md";
import ProfilePhoto from "../../../Assets/profile-picture.png";
import RestaurantDisplay from "../../../Assets/restaurant-display-img.png";
import { IoLogoInstagram } from "react-icons/io5";

const Shop = () => {
  const navigate = useNavigate();
  const shopId = useParams()?.id;

  const [shop, setShop] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextUrl, setNextUrl] = useState(null);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const userData = { id: 1, role: "user" };

  const dummyShop = {
    shop_name: "Villa The Grand Buffet",
    shop_description: "Step into Villa The Grand Buffet, Pakistan’s premier destination for buffet dining, where luxury meets culinary excellence. Located in the heart of the city, Villa offers an upscale and spacious dining experience perfect for families, corporate gatherings, and celebrations. Savor an extravagant spread of over 100+ dishes, carefully curated from Pakistani, Continental, Chinese, BBQ, Italian, and Live Cooking stations. Whether you crave rich traditional curries, sizzling grilled delights, or freshly baked desserts, Villa promises an indulgent journey for every palate.",
    shop_perks: ["Buffet Variety", "Live Cooking", "Outdoor Seating"],
    shop_tags: ["FamilyFriendly", "TopRated"],
    whatsapp: "1234567890",
    instagram: "https://instagram.com/thebuffet",
    shop_photos: Array(5).fill({ url: RestaurantDisplay, main: false }).map((p, i) => ({
      ...p,
      main: i === 0,
    })),
    average_ratings: {
      overall_average: 8.6,
      average_ratings: {
        clean: 8,
        ambiance: 9,
        hospitality: 8,
        service: 9,
        value: 8,
      },
    },
  };

  const dummyServices = [
    {
      title: "Lunch Buffet",
      description: "30+ items including BBQ, Continental, and Desi dishes.",
      price: 2199,
      photo_url: RestaurantDisplay,
    },
  ];

  const dummyReviews = Array.from({ length: 12 }, (_, index) => ({
    id: index + 1,
    user: 1,
    user_name: `User ${index + 1}`,
    date: "2025-05-10",
    profile_photo: null,
    average_rating: Math.floor(Math.random() * 3) + 7,
    remarks: `This is comment #${index + 1}. Everything was great!`,
    date_of_visit: "2025-05-01",
    treatment_duration: 2,
    treatment_spending: `Rs. ${2000 + index * 100}`,
    service: 9,
    clean: 8,
    hospitality: 9,
    ambiance: 8,
    value: 8,
    photo_urls: [],
  }));

  useEffect(() => {
    setTimeout(() => {
      setShop(dummyShop);
      setServices(dummyServices);
      setReviews(dummyReviews);
      setLoading(false);
    }, 500);
  }, [refresh]);

  const rating = (number) => {
    if (number < 5) return "Below Average";
    if (number < 7) return "Above Average";
    if (number < 8) return "Good";
    return "Highly Rated";
  };

  const confirm = async (id) => {
    message.success("Review deleted successfully");
    setReviews(reviews.filter((r) => r.id !== id));
  };

  const items = [
    {
      key: "1",
      label: "Perks",
      children: dummyShop.shop_perks.map((perk, index) => (
        <div className="tag" key={index}>
          <p className="tag-text">#{perk}</p>
        </div>
      )),
    },
    {
      key: "2",
      label: "Tags",
      children: dummyShop.shop_tags.map((tag, index) => (
        <div className="tag" key={index}>
          <p className="tag-text">#{tag}</p>
        </div>
      )),
    },
  ];

  return (
    <div className="shop">
      <Navbar title="Shop" />
      <hr />
      <div className="shop-body">
        {loading ? (
          <div className="full-screen-overlay">Loading...</div>
        ) : (
          <>
            {/* Images */}
            <div className="images">
              <div className="main-image">
                <Image src={dummyShop.shop_photos[0].url} alt="Main" />
              </div>
              <div className="image-container">
                {dummyShop.shop_photos
                  .filter((p) => !p.main)
                  .map((photo, index) => (
                    <div className="img-wrap" key={index}>
                      <Image src={photo.url} alt="Extra" />
                    </div>
                  ))}
              </div>
            </div>

            {/* Text Body */}
            <div className="text-body-container">
              <div className="shop-details">
                <p className="heading">{shop.shop_name}</p>
                <p className="text">{shop.shop_description}</p>
                <div className="shop-info">
                  <MdWhatsapp color="green" className="social-icon" />
                  <span className="text">+{shop.whatsapp}</span>
                </div>
                <div className="shop-info">
                  <IoLogoInstagram color="purple" className="social-icon" />
                  <span className="text">@thebuffet</span>
                </div>
              </div>
              <div className="shop-stats">
                <div className="stat-info">
                  <p className="rating">{shop.average_ratings.overall_average}</p>
                  <p className="subheading">
                    {rating(shop.average_ratings.overall_average)}
                  </p>
                </div>
                <Button className="review-button" onClick={() => setOpenModal(true)}>
                  Add a Review
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <div className="tabs-container">
              <ConfigProvider
                theme={{
                  components: {
                    Tabs: {
                      itemSelectedColor: "#f0e569",
                      inkBarColor: "#f0e569",
                    },
                  },
                }}
              >
                <Tabs defaultActiveKey="1" items={items} />
              </ConfigProvider>
            </div>

            {/* Services */}
            <div className="services">
              <div className="services-container">
                <p className="heading">Services Offered</p>
                <div className="services-list">
                  {services.map((item, index) => (
                    <div className="service-card" key={index}>
                      <img src={item.photo_url} alt="service" />
                      <p className="textheading">{item.title}</p>
                      <p className="subtext">{item.description}</p>
                      <Button className="review-button">${item.price}</Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="reviews">
              <p className="heading">Reviews</p>
              <div className="review-container">
                <div className="ratings">
                  <p className="rating">{shop.average_ratings.overall_average}/10</p>
                  {["clean", "ambiance", "hospitality", "service", "value"].map((key) => (
                    <div className="percentage" key={key}>
                      <p>{key.charAt(0).toUpperCase() + key.slice(1)}</p>
                      <Progress
                        percent={shop.average_ratings.average_ratings[key] * 10}
                        strokeColor="#FAEF7C"
                      />
                    </div>
                  ))}
                </div>
                <div className="comments">
                  {reviews.map((item) => (
                    <div className="comment-container" key={item.id}>
                      <div className="image-container">
                        <img
                          src={item.profile_photo || ProfilePhoto}
                          alt="profile"
                          className="navigator"
                          onClick={() => navigate("/profile/" + item.user)}
                        />
                      </div>
                      <div className="data-container">
                        <div className="name-text">
                          <p onClick={() => navigate("/profile/" + item.user)}>{item.user_name}</p>
                          <p className="date">{item.date}</p>
                          <div style={{ display: "flex", gap: "10px" }}>
                            <p className="rating-value">{item.average_rating}</p>
                            {item.user === userData.id && (
                              <Popconfirm
                                title="Delete Review"
                                description="Are you sure you want to delete this review?"
                                onConfirm={() => confirm(item.id)}
                                okText="Yes"
                                cancelText="No"
                              >
                                <DeleteOutlined />
                              </Popconfirm>
                            )}
                          </div>
                        </div>
                        <p className="comment-body">{item.remarks}</p>
                        <div className="visit-information">
                          <p>Date of Visit: {item.date_of_visit}</p>
                          <p>Duration: {item.treatment_duration} hours</p>
                          <p>Spent: {item.treatment_spending}</p>
                        </div>
                        <div className="rating-types">
                          {["service", "clean", "hospitality", "ambiance", "value"].map((key) => (
                            <p key={key}>
                              {key.charAt(0).toUpperCase() + key.slice(1)}: {item[key]}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <Footer />
      <ReviewModal
        open={openModal}
        setOpen={setOpenModal}
        shopId={shopId}
        setRefresh={setRefresh}
      />
    </div>
  );
};

export default Shop;