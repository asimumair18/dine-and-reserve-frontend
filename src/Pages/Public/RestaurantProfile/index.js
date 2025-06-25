import {
  Button,
  Progress,
  Tabs,
  ConfigProvider,
  Popconfirm,
  message,
  Image,
} from "antd";
import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../../Context/UserContext";
import Footer from "../../../Components/Footer";
import Navbar from "../../../Components/Navbar";
import ReviewModal from "../../../Components/Common/ReviewModal";
import "./style.css";
import { DeleteOutlined, WifiOutlined, CarOutlined, SmileOutlined } from "@ant-design/icons";
import { MdOutlineRestaurantMenu } from "react-icons/md";
import { MdOutlineAir } from "react-icons/md";
import { PiToilet } from "react-icons/pi";
import { IoCardOutline } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { MdWhatsapp } from "react-icons/md";
import ProfilePhoto from "../../../Assets/profile-picture.png";
import RestaurantDisplay from "../../../Assets/restaurant-display-img.png";
import { IoLogoInstagram } from "react-icons/io5";
import ReserveTableModal from "../../../Components/Common/ReserveTableModal";
import { AiOutlineStar } from "react-icons/ai";

const perkIcons = {
  "Free Wifi": <WifiOutlined />,
  "Air Conditioning": <MdOutlineAir />,
  "Private Restrooms": <PiToilet />,
  "Membership Card": <IoCardOutline />,
  "Buffet Variety": <MdOutlineRestaurantMenu />,
  "Live Cooking": <SmileOutlined />,
  "Outdoor Seating": <SmileOutlined />,
  "Free Parking": <CarOutlined />,
  "24-Hour Service": <SmileOutlined />,
};

const Shop = () => {
  const navigate = useNavigate();
  const shopId = useParams()?.id;

  const [shop, setShop] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [reserveModalOpen, setReserveModalOpen] = useState(false);
  const [error, setError] = useState(null);

  const { userData } = useContext(UserContext);
  const isOwner = userData?.id === shopId;
  const menuData = shop?.menus || [];
  useEffect(() => {
    const fetchShop = async () => {
      try {
        const res = await fetch(`/api/restaurant/public/${shopId}`);

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`API Error ${res.status}: ${errorText}`);
        }

        const data = await res.json();
        setShop({
          shop_name: data.fullName,
          shop_description: data.description,
          shop_address: data.restaurantAddress,
          shop_perks: data.perks || [],
          whatsapp: data.phone,
          instagram: data.instagram,
          allergen_alert: data.allergenAlert,
          shop_photos: [
            {
              url: data.mainImage?.startsWith("/uploads/")
                ? data.mainImage
                : data.mainImage
                  ? `/uploads/${data.mainImage}`
                  : RestaurantDisplay,
              main: true,
            },
            ...(data.displayImages || []).map((img) => ({
              url: img?.startsWith("/uploads/")
                ? img
                : img
                  ? `/uploads/${img}`
                  : RestaurantDisplay,
              main: false,
            })),
          ],
          // shop_photos: [
          //   { url: RestaurantDisplay, main: true },
          //   { url: RestaurantDisplay, main: false },
          //   { url: RestaurantDisplay, main: false },
          //   { url: RestaurantDisplay, main: false },
          //   { url: RestaurantDisplay, main: false },
          // ],
          average_ratings: {
            overall_average: data.averageRating || 0,
            average_ratings: data.ratingDetails || {
              clean: 0,
              ambiance: 0,
              hospitality: 0,
              service: 0,
              value: 0,
            },
          },
          timings: {
            high_tea: data.timings?.highTea || "",
            buffet: data.timings?.buffet || "",
          },
          menus: data.menus || [],
        });

        setServices(data.deals || []);
        setReviews(
          (data.reviews || []).map((rev) => ({
            id: rev._id,
            user: rev.userId,
            user_name: rev.email,
            profile_photo: rev.userPhoto ? `/uploads/${rev.userPhoto}` : null,
            date: new Date(rev.createdAt).toLocaleDateString(),
            average_rating: rev.averageRating,
            remarks: rev.remarks,
            date_of_visit: rev.dateOfVisit,
            treatment_duration: rev.duration,
            treatment_spending: rev.amountSpent,
            service: rev.service,
            clean: rev.clean,
            hospitality: rev.hospitality,
            ambiance: rev.ambiance,
            value: rev.value,
            photo_urls: rev.photoUrls || [],
          }))
        );
      } catch (err) {
        console.error("Failed to fetch restaurant:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchShop();
  }, [refresh, shopId]);

  const rating = (number) => {
    if (number < 5) return "Below Average";
    if (number < 7) return "Above Average";
    if (number < 8) return "Good";
    return "Highly Rated";
  };

  const confirm = async (id) => {
    try {
      await fetch(`/api/reviews/${id}`, { method: "DELETE" }); // ✅ actual delete call
      message.success("Review deleted successfully");
      setRefresh(!refresh); // refresh to re-fetch
    } catch (err) {
      console.error("Delete failed:", err);
      message.error("Failed to delete review");
    }
  };

  const items = [];

  if (shop?.shop_perks?.length > 0) {
    items.push({
      key: "1",
      label: "Perks",
      children: (
        <div className="perk-icon-list">
          {shop.shop_perks.map((perk, index) => (
            <div className="perk-icon-item" key={index}>
              <span className="perk-icon">{perkIcons[perk]}</span>
              <span className="perk-label">{perk}</span>
            </div>
          ))}
        </div>
      ),
    });
  }

  if (menuData.length > 0) {
    items.push({
      key: "2",
      label: "Menu",
      children: (
        <div className="menu-grid">
          {menuData.map((menu, i) => (
            <div className="menu-card" key={i}>
              <p className="menu-title">{menu.title || "Menu"}</p>
              <p className="menu-category">{menu.category || "No category"}</p>
              <div className="divider" />
              {Array.isArray(menu.items) && menu.items.length > 0 ? (
                menu.items.map((item, j) => (
                  <div className="menu-item" key={j}>
                    <div className="dish-line">
                      <div className="left">
                        <AiOutlineStar className="menu-icon" />
                        <span className="dish-name">{item.name}</span>
                      </div>
                      <div className="right">
                        <span className="cal-icon">🔥</span>
                        <span className="dish-calories">{item.calories} Cal</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ padding: "0 10px" }}>No items in this menu.</p>
              )}
              <div className="divider" />
            </div>
          ))}
        </div>
      ),
    });
  }

  return (
    <div className="shop">
      <Navbar title="Restaurant" />
      <hr />
      <div className="shop-body">
        {error ? (
          <div className="error-message">
            <p>{error}</p>
            <Button onClick={() => setRefresh(!refresh)}>Retry</Button>
          </div>
        ) : loading ? (
          <p>Loading restaurant info...</p>
        ) : (
          <>
            {/* Images Section */}
            <div className="images">
              <div className="main-image">
                {/* Temporarily disable dynamic image loading */}
                <Image
                  src={shop.shop_photos[0]?.url || RestaurantDisplay}
                  alt="Main Display"
                  loading="lazy"
                />
                {/* <Image
                  src={RestaurantDisplay}
                  alt="Main Display"
                  loading="lazy"
                /> */}
              </div>
              <div className="image-container">
                {/* Temporarily disable dynamic image loading */}
                {shop.shop_photos
                  .filter((p) => !p.main)
                  .map((photo, index) => (
                    <div className="img-wrap" key={index}>
                      <Image
                        src={photo.url || RestaurantDisplay}
                        alt={`Extra ${index + 1}`}
                        loading="lazy"
                      />
                    </div>
                  ))}

                {/* Placeholder images */}
                {/* {[1, 2, 3, 4].map((_, index) => (
                  <div className="img-wrap" key={index}>
                    <Image
                      src={RestaurantDisplay}
                      alt={`Placeholder ${index + 1}`}
                      loading="lazy"
                    />
                  </div>
                ))} */}
              </div>
            </div>

            {/* Shop Description & Contact */}
            <div className="text-body-container">
              <div className="shop-details">
                <p className="heading">{shop.shop_name}</p>
                <p className="text">
                  {shop.shop_description?.trim()
                    ? shop.shop_description
                    : "No description added yet."}
                </p>

                {(shop.timings?.high_tea || shop.timings?.buffet) ? (
                  <div className="shop-timings">
                    {shop.timings.high_tea && (
                      <div className="timing-row">
                        <span className="label">High-Tea:</span>
                        <span className="value">{shop.timings.high_tea}</span>
                      </div>
                    )}
                    {shop.timings.buffet && (
                      <div className="timing-row">
                        <span className="label">Buffet:</span>
                        <span className="value">{shop.timings.buffet}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text">No timings added yet.</p>
                )}

                <div className="shop-info">
                  <MdWhatsapp color="green" className="social-icon" />
                  <span className="text">+{shop.whatsapp || "Phone not provided"}</span>
                </div>
                <div className="shop-info">
                  <IoLogoInstagram color="purple" className="social-icon" />
                  <span className="text">
                    {shop.instagram?.trim()
                      ? `@${shop.instagram.split("/").pop()}`
                      : "Instagram Not Added"}
                  </span>
                </div>

                <p className="allergen-alert">
                  {shop.shop_address || "Address not available"}
                </p>

                {shop.allergen_alert && (
                  <div className="allergen-alert">
                    <span className="warn-sign">⚠️</span> This restaurant may include common
                    allergens: Nuts, Dairy.
                  </div>
                )}
              </div>

              <div className="shop-stats">
                <div className="stat-info">
                  <p className="rating">{shop.average_ratings.overall_average}</p>
                  <p className="subheading">
                    {rating(shop.average_ratings.overall_average)}
                  </p>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <Button
                    className="review-button"
                    onClick={() => {
                      if (!userData) navigate("/login");
                      else setOpenModal(true);
                    }}
                  >
                    Write A Review
                  </Button>
                  <Button
                    className="review-button"
                    onClick={() => {
                      if (!userData) navigate("/login");
                      else setReserveModalOpen(true);
                    }}
                  >
                    Reserve Table
                  </Button>
                </div>
              </div>
            </div>
            {/* Tabs Section */}
            <div className="tabs-container">
              <ConfigProvider
                theme={{
                  components: {
                    Tabs: {
                      itemSelectedColor: "#B76E79",
                      inkBarColor: "#B76E79",
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "16px",
                      fontWeightStrong: "600",
                    },
                  },
                }}
              >
                {items.length > 0 ? (
                  <Tabs defaultActiveKey="1" items={items} />
                ) : (
                  <p>No content to show yet.</p>
                )}
              </ConfigProvider>
            </div>

            {/* Services Offered */}
            <div className="services">
              <div className="services-container">
                <p className="heading">Services Offered</p>
                <div className="services-list">
                  {services.length > 0 ? (
                    services.map((item, index) => (
                      <div className="service-card" key={index}>
                        <img src={item.photo_url} alt="service" />
                        <p className="textheading">{item.title}</p>
                        <p className="subtext">{item.description}</p>
                        <Button className="review-button">Rs. {item.price}</Button>
                      </div>
                    ))
                  ) : (
                    <p>No services added yet.</p>
                  )}
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
                  {reviews.length > 0 ? (
                    reviews.map((item) => (
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
                              {item.user === userData?.id && (
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
                    ))
                  ) : (
                    <p>No reviews yet.</p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer and Modals */}
      <Footer />
      <ReviewModal
        open={openModal}
        setOpen={setOpenModal}
        shopId={shopId}
        setRefresh={setRefresh}
      />
      <ReserveTableModal
        open={reserveModalOpen}
        onClose={() => setReserveModalOpen(false)}
        shopId={shopId}
        setRefresh={setRefresh}
      />
    </div>
  );
};

export default Shop;
