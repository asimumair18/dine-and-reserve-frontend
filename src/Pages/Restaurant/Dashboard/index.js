import {
    Button,
    Progress,
    Tabs,
    ConfigProvider,
    Popconfirm,
    message,
    Image,
    Checkbox,
    Dropdown,
    Form,
    Input,
    Modal,
    InputNumber,
    Table,
    Tag,
    Upload,
    Menu,
} from "antd";
import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../../Context/UserContext";
import Footer from "../../../Components/Footer";
import Navbar from "../../../Components/Navbar";
import "./style.css";
import { DeleteOutlined, WifiOutlined, CarOutlined, SmileOutlined, MoreOutlined } from "@ant-design/icons";
import { MdOutlineRestaurantMenu } from "react-icons/md";
import { MdOutlineAir } from "react-icons/md";
import { PiToilet } from "react-icons/pi";
import { IoCardOutline } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { MdWhatsapp } from "react-icons/md";
import ProfilePhoto from "../../../Assets/profile-picture.png";
import RestaurantDisplay from "../../../Assets/restaurant-display-img.png";
import { IoLogoInstagram } from "react-icons/io5";
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
    const { userData } = useContext(UserContext);
    const [shop, setShop] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [menuData, setMenuData] = useState([]);
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refresh, setRefresh] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [reserveModalOpen, setReserveModalOpen] = useState(false);
    const [menuModalOpen, setMenuModalOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [form] = Form.useForm();
    const [dealModalOpen, setDealModalOpen] = useState(false);
    const [editingDealIndex, setEditingDealIndex] = useState(null);
    const [dealForm] = Form.useForm();
    const [selectedPerks, setSelectedPerks] = useState([]);
    const [perkDropdownOpen, setPerkDropdownOpen] = useState(false);

    const allPerks = Object.keys(perkIcons);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Fetch restaurant profile
                const profileRes = await fetch('/api/restaurant/profile', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                });
                const profile = await profileRes.json();
                console.log("Profile Data:", profile);

                // 2. Fetch reviews
                const reviewsRes = await fetch(`/api/reviews/${profile._id}`);
                const reviewsData = await reviewsRes.json();

                // 3. Fetch reservations
                const resvRes = await fetch(`/api/reservations/restaurant/${profile._id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                });
                const resvData = await resvRes.json();

                // 4. Transform data
                setShop({
                    ...profile,
                    shop_name: profile.fullName,
                    shop_description: profile.description,
                    shop_address: profile.restaurantAddress,
                    shop_perks: profile.perks || [],
                    shop_photos: [
                        {
                            url: profile.mainImage?.startsWith('/uploads/')
                                ? profile.mainImage
                                : `/uploads/${profile.mainImage}`,
                            main: true
                        },
                        ...(profile.displayImages || []).map(img => ({
                            url: img?.startsWith('/uploads/')
                                ? img
                                : `/uploads/${img}`,
                            main: false
                        }))
                    ],
                    average_ratings: {
                        overall_average: profile.averageRating || 0,
                        average_ratings: profile.ratingDetails || {
                            clean: 0, ambiance: 0, hospitality: 0,
                            service: 0, value: 0
                        }
                    },
                    timings: {
                        high_tea: profile.timings?.highTea || "",
                        buffet: profile.timings?.buffet || ""
                    },
                    allergen_alert: profile.allergenAlert || false,
                    whatsapp: profile.phone || "",
                    instagram: profile.instagram || ""
                });

                setSelectedPerks(profile.perks || []);
                setMenuData(profile.menus || []);
                setDeals(
                    (profile.deals || []).map(deal => ({
                        ...deal,
                        photo_url: deal.photo_url?.startsWith("/uploads/")
                            ? deal.photo_url
                            : `/uploads/${deal.photo_url}`
                    }))
                );

                setReviews(reviewsData.map(rev => ({
                    id: rev._id,
                    user: rev.userId,
                    user_name: rev.email,
                    date: new Date(rev.createdAt).toLocaleDateString(),
                    profile_photo: rev.userPhoto
                        ? `/uploads/${rev.userPhoto}`
                        : ProfilePhoto,
                    average_rating: rev.averageRating,
                    remarks: rev.remarks,
                    date_of_visit: rev.dateOfVisit,
                    treatment_duration: rev.duration,
                    treatment_spending: `Rs. ${rev.amountSpent}`,
                    service: rev.service,
                    clean: rev.clean,
                    hospitality: rev.hospitality,
                    ambiance: rev.ambiance,
                    value: rev.value
                })));

                setReservations(resvData.map(res => ({
                    id: res._id,
                    profile: res.dinerId.profilePhoto
                        ? `/uploads/${res.dinerId.profilePhoto}`
                        : ProfilePhoto,
                    name: res.name,
                    people: res.people,
                    date: res.date,
                    type: res.type === "high-tea" ? "High Tea" : "Buffet",
                    time: Array.isArray(res.timeSlot)
                        ? res.timeSlot.join(" - ")
                        : res.timeSlot,
                    status: res.status
                })));

            } catch (err) {
                console.error("Failed to fetch data:", err);
                message.error("Failed to load data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [refresh]);

    // Update perks
    const handlePerkChange = async (checkedValues) => {
        try {
            await fetch('/api/restaurant/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ perks: checkedValues })
            });
            setSelectedPerks(checkedValues);
            setShop(prev => ({ ...prev, shop_perks: checkedValues }));
            message.success("Perks updated successfully");
        } catch (err) {
            console.error("Perk update failed:", err);
            message.error("Failed to update perks");
        }
    };

    // Menu CRUD operations
    const handleMenuSubmit = async (values) => {
        try {
            let response;
            if (editingIndex !== null) {
                // Update existing menu
                response = await fetch(`/api/menu/${menuData[editingIndex]._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify(values)
                });
            } else {
                // Add new menu
                response = await fetch('/api/menu/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify(values)
                });
            }

            if (!response.ok) {
                throw new Error('Menu operation failed');
            }

            setRefresh(!refresh);
            setMenuModalOpen(false);
            message.success(
                `Menu ${editingIndex !== null ? 'updated' : 'added'} successfully`
            );
        } catch (err) {
            console.error("Menu operation failed:", err);
            message.error("Operation failed");
        }
    };

    const handleDeleteMenu = async (id) => {
        try {
            await fetch(`/api/menu/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setRefresh(!refresh);
            message.success("Menu deleted successfully");
        } catch (err) {
            console.error("Menu delete failed:", err);
            message.error("Delete failed");
        }
    };

    // Deal CRUD operations
    const handleDealSubmit = async (values) => {
        try {
            let response;
            if (editingDealIndex !== null) {
                // Update existing deal
                response = await fetch(`/api/deals/${deals[editingDealIndex]._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify(values)
                });
            } else {
                // Add new deal
                response = await fetch('/api/deals/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify(values)
                });
            }

            if (!response.ok) {
                throw new Error('Deal operation failed');
            }

            setRefresh(!refresh);
            setDealModalOpen(false);
            message.success(
                `Deal ${editingDealIndex !== null ? 'updated' : 'added'} successfully`
            );
        } catch (err) {
            console.error("Deal operation failed:", err);
            message.error("Operation failed");
        }
    };

    // Reservation actions
    const handleReservationAction = async (id, status) => {
        try {
            await fetch('/api/reservations/status', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    reservationId: id,
                    status
                })
            });
            setRefresh(!refresh);
            message.success(`Reservation ${status}`);
        } catch (err) {
            console.error("Reservation action failed:", err);
            message.error("Action failed");
        }
    };

    // Delete review
    const handleDeleteReview = async (id) => {
        try {
            await fetch(`/api/reviews/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setRefresh(!refresh);
            message.success("Review deleted");
        } catch (err) {
            console.error("Review delete failed:", err);
            message.error("Delete failed");
        }
    };

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



    const handleAccept = (id) => {
        setReservations((prev) =>
            prev.map((r) => (r.id === id ? { ...r, status: "accepted" } : r))
        );
        setTimeout(() => {
            message.success("Reservation accepted successfully.");
        }, 100);
    };

    const handleReject = (id) => {
        setReservations((prev) =>
            prev.map((r) => (r.id === id ? { ...r, status: "rejected" } : r))
        );
        setTimeout(() => {
            message.success("Reservation rejected.");
        }, 100);
    };

    const dropdownMenu = (
        <div style={{ padding: "10px", maxHeight: "200px", overflowY: "auto" }}>
            <Checkbox.Group
                options={allPerks}
                value={selectedPerks}
                onChange={handlePerkChange}
            />
        </div>
    );

    const items = [
        {
            key: "1",
            label: "Perks",
            children: (
                <>
                    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 50 }}>
                        <Dropdown
                            overlay={dropdownMenu}
                            trigger={["click"]}
                            placement="bottomRight"
                            open={perkDropdownOpen}
                            onOpenChange={(flag) => setPerkDropdownOpen(flag)}
                        >
                            <Button className="submit-button" type="primary">
                                {perkDropdownOpen ? "Hide Perks ⬆" : "Edit Perks ⬇"}
                            </Button>
                        </Dropdown>
                    </div>
                    <div className="perk-icon-list">
                        {selectedPerks.map((perk, index) => (
                            <div className="perk-icon-item" key={index}>
                                <span className="perk-icon">{perkIcons[perk]}</span>
                                <span className="perk-label">{perk}</span>
                            </div>
                        ))}
                    </div>
                </>
            ),
        },
        {
            key: "2",
            label: "Menu",
            children: (
                <div className="menu-grid">
                    <div style={{ width: "100%", marginBottom: 20, display: "flex", justifyContent: "flex-end" }}>
                        <Button
                            type="primary"
                            className="submit-button"
                            onClick={() => {
                                form.resetFields();
                                setMenuModalOpen(true);
                            }}
                        >
                            + Add Menu Card
                        </Button>
                    </div>

                    {menuData.map((menu, i) => (
                        <div className="menu-card" key={i} style={{ position: "relative" }}>
                            {/* Dropdown top-right */}
                            <div style={{ position: "absolute", top: 10, right: 10, zIndex: 2 }}>
                                <Dropdown
                                    overlay={
                                        <Menu>
                                            <Menu.Item
                                                key="edit"
                                                onClick={() => {
                                                    form.setFieldsValue(menu);
                                                    setEditingIndex(i);
                                                    setMenuModalOpen(true);
                                                }}
                                            >
                                                Edit
                                            </Menu.Item>
                                            <Menu.Item key="delete">
                                                <Popconfirm
                                                    title="Delete Menu Card"
                                                    description="Are you sure you want to delete this menu card?"
                                                    onConfirm={() => handleDeleteMenu(menu._id)}
                                                    okText="Yes"
                                                    cancelText="No"
                                                    placement="left"
                                                >
                                                    <a style={{ color: "red" }}>Delete</a>
                                                </Popconfirm>
                                            </Menu.Item>
                                        </Menu>
                                    }
                                    trigger={["click"]}
                                    placement="bottomRight"
                                >
                                    <Button
                                        type="text"
                                        icon={
                                            <MoreOutlined
                                                style={{ fontSize: 18, fontWeight: 800, color: "#333" }}
                                            />
                                        }
                                        style={{
                                            backgroundColor: "rgba(255, 255, 255, 0.9)",
                                            borderRadius: "8px",
                                            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                                            padding: "4px 6px",
                                        }}
                                    />
                                </Dropdown>
                            </div>

                            {/* Card Content */}
                            <p className="menu-title">Our Menu</p>
                            <p className="menu-category">{menu.category}</p>
                            <div className="divider" />
                            {menu.items.map((item, j) => (
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
                            ))}
                            <div className="divider" />
                        </div>
                    ))}

                </div>
            )
        },
        {
            key: "3",
            label: "Reservations",
            children: (

                <ConfigProvider
                    theme={{
                        components: {
                            Table: {
                                fontFamily: "Poppins, sans-serif",
                                headerBg: "#e3ccb2",
                                headerColor: "#000",
                                borderColor: "#f0f0f0",
                            },
                        },
                    }}
                >
                    <div className="reservation-table-container">
                        <Table
                            dataSource={reservations}
                            rowKey="id"
                            pagination={false}
                            style={{ overflowX: "auto" }}
                        >
                            <Table.Column
                                title="Profile"
                                dataIndex="profile"
                                key="profile"
                                render={(src) => <img src={src} alt="profile" style={{ width: 40, borderRadius: "50%" }} />}
                            />
                            <Table.Column title="Name" dataIndex="name" key="name" />
                            <Table.Column title="People" dataIndex="people" key="people" />
                            <Table.Column title="Date" dataIndex="date" key="date" />
                            <Table.Column title="Type" dataIndex="type" key="type" />
                            <Table.Column title="Time Slot" dataIndex="time" key="time" />
                            <Table.Column
                                title="Action"
                                key="action"
                                render={(_, record) => {
                                    if (record.status === "accepted")
                                        return (
                                            <Tag color="green" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500 }}>
                                                Accepted
                                            </Tag>
                                        );

                                    if (record.status === "rejected")
                                        return (
                                            <Tag color="red" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500 }}>
                                                Rejected
                                            </Tag>
                                        );
                                    return (
                                        <div style={{ display: "flex", gap: "10px", fontFamily: "Poppins, sans-serif" }}>
                                            <Popconfirm
                                                title="Accept Reservation"
                                                description="Are you sure you want to accept this reservation?"
                                                onConfirm={() => handleReservationAction(record.id, "accepted")}
                                                okText="Yes"
                                                cancelText="No"
                                            >
                                                <Button
                                                    type="primary"
                                                    style={{
                                                        backgroundColor: "#b2d3c2",
                                                        borderRadius: "20px",
                                                        border: "none",
                                                        fontWeight: "500",
                                                        fontFamily: "Poppins, sans-serif",
                                                    }}
                                                >
                                                    Accept
                                                </Button>
                                            </Popconfirm>

                                            <Popconfirm
                                                title="Reject Reservation"
                                                description="Are you sure you want to reject this reservation?"
                                                onConfirm={() => handleReservationAction(record.id, "rejected")}
                                                okText="Yes"
                                                cancelText="No"
                                            >
                                                <Button
                                                    type="primary"
                                                    danger
                                                    style={{
                                                        backgroundColor: "#f8b2b2",
                                                        borderRadius: "20px",
                                                        border: "none",
                                                        fontWeight: "500",
                                                        fontFamily: "Poppins, sans-serif",
                                                    }}
                                                >
                                                    Reject
                                                </Button>
                                            </Popconfirm>
                                        </div>
                                    );
                                }}
                            />
                        </Table>
                    </div>
                </ConfigProvider>
            ),
        }
    ];

    return (
        <div className="shop">
            <Navbar title="Restaurant" />
            <hr />
            <div className="shop-body">
                {!loading && (
                    <>
                        {/* Images */}
                        <div className="images">
                            <div className="main-image">
                                <Image
                                    src={shop.shop_photos[0]?.url}
                                    alt="Main"
                                />
                            </div>
                            <div className="image-container">
                                {shop.shop_photos
                                    .filter((p) => !p.main)
                                    .map((photo, index) => (
                                        <div className="img-wrap" key={index}>
                                            <Image src={photo.url} alt="Extra" />
                                        </div>
                                    ))
                                }
                            </div>
                        </div>

                        {/* Text Body */}
                        <div className="text-body-container">
                            <div className="shop-details">
                                <p className="heading">{shop.shop_name}</p>
                                <p className="text">{shop.shop_description}</p>
                                {(shop.timings?.high_tea || shop.timings?.buffet) && (
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
                                )}
                                <div className="shop-info">
                                    <MdWhatsapp color="green" className="social-icon" />
                                    <span className="text">+{shop.whatsapp}</span>
                                </div>
                                <div className="shop-info">
                                    <IoLogoInstagram color="purple" className="social-icon" />
                                    <span className="text">@thebuffet</span>
                                </div>
                                <p className="allergen-alert">
                                    {shop.shop_address}
                                </p>
                                {shop.allergen_alert && (
                                    <div className="allergen-alert">
                                        <span className="warn-sign">⚠️</span> This restaurant may include common allergens: Nuts, Dairy.
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
                            </div>
                        </div>

                        {/* Tabs */}
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
                                <Tabs defaultActiveKey="1" items={items} />
                            </ConfigProvider>
                        </div>

                        {/* Deals */}
                        <div className="services">
                            <div className="services-container">
                                <p className="heading">Deals Offered</p>

                                <div style={{ width: "100%", marginBottom: 20, display: "flex", justifyContent: "flex-end" }}>
                                    <Button
                                        type="primary"
                                        className="submit-button"
                                        onClick={() => {
                                            dealForm.resetFields();
                                            setDealModalOpen(true);
                                        }}
                                    >
                                        + Add Deal
                                    </Button>
                                </div>

                                <div className="services-list">
                                    {deals.map((item, index) => (
                                        <div className="service-card" key={index}>
                                            <img src={item.photo_url} alt="deal" />
                                            <p className="textheading">{item.title}</p>
                                            <p className="subtext">{item.description}</p>
                                            <Button className="review-button">Rs. {item.price}</Button>
                                            <div style={{ position: "absolute", top: 10, right: 10 }}>
                                                <Dropdown
                                                    overlay={
                                                        <Menu>
                                                            <Menu.Item
                                                                key="edit"
                                                                onClick={() => {
                                                                    dealForm.setFieldsValue(item);
                                                                    setEditingDealIndex(index);
                                                                    setDealModalOpen(true);
                                                                }}
                                                            >
                                                                Edit
                                                            </Menu.Item>
                                                            <Menu.Item key="delete">
                                                                <Popconfirm
                                                                    title="Delete Deal"
                                                                    description="Are you sure you want to delete this deal?"
                                                                    onConfirm={() => {
                                                                        const updated = deals.filter((_, i) => i !== index);
                                                                        setDeals(updated);
                                                                        message.success('Deal deleted successfully');
                                                                    }}
                                                                    okText="Yes"
                                                                    cancelText="No"
                                                                    placement="left"
                                                                >
                                                                    <a style={{ color: 'red' }}>Delete</a>
                                                                </Popconfirm>
                                                            </Menu.Item>
                                                        </Menu>
                                                    }
                                                    trigger={['click']}
                                                    placement="bottomRight"
                                                >
                                                    <Button
                                                        type="text"
                                                        icon={<MoreOutlined style={{ fontSize: 18, fontWeight: 800, color: '#333' }} />}
                                                        style={{
                                                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                                            borderRadius: '8px',
                                                            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                                                            padding: '4px 6px',
                                                        }}
                                                    />
                                                </Dropdown>
                                            </div>
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
                                                    src={item.profile_photo}
                                                    alt="profile"
                                                    className="navigator"
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
                                                                onConfirm={() => handleDeleteReview(item.id)}
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
            <Modal
                open={dealModalOpen}
                title={editingDealIndex !== null ? "Edit Deal" : "Add Deal"}
                onCancel={() => {
                    setEditingDealIndex(null);
                    dealForm.resetFields();
                    setDealModalOpen(false);
                }}
                onOk={() => {
                    dealForm.validateFields().then((values) => {
                        handleDealSubmit(values);
                    });
                }}
            >
                <Form
                    form={dealForm}
                    layout="vertical"
                    initialValues={{ photo_url: null }}
                >
                    <Form.Item name="title" label="Deal Title" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name="description" label="Description" rules={[{ required: true }]}>
                        <Input.TextArea />
                    </Form.Item>

                    <Form.Item name="price" label="Price After Discount" rules={[{ required: true, type: "number" }]}>
                        <InputNumber style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item name="photo_url" label="Deal Image">
                        <Upload
                            listType="picture-card"
                            maxCount={1}
                            beforeUpload={() => false} // Prevent auto upload
                            onChange={(info) => {
                                const file = info.fileList[0]?.originFileObj;
                                if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                        dealForm.setFieldsValue({ photo_url: reader.result });
                                    };
                                    reader.readAsDataURL(file);
                                }
                            }}
                            showUploadList={false}
                        >
                            <Button>Upload Image</Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                open={menuModalOpen}
                title={editingIndex !== null ? "Edit Menu Card" : "Add Menu Card"}
                onCancel={() => {
                    setEditingIndex(null);
                    form.resetFields();
                    setMenuModalOpen(false);
                }}
                onOk={() => {
                    form.validateFields().then((values) => {
                        handleMenuSubmit(values);
                    });
                }}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="category" label="Category" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.List name="items" initialValue={[{ name: "", calories: 0 }]}>
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (
                                    <div key={key} style={{ display: "flex", gap: 10, marginBottom: 8 }}>
                                        <Form.Item
                                            {...restField}
                                            name={[name, "name"]}
                                            rules={[{ required: true, message: "Item name required" }]}
                                            style={{ flex: 1 }}
                                        >
                                            <Input placeholder="Dish Name" />
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, "calories"]}
                                            rules={[{ required: true, type: "number", message: "Calories required" }]}
                                            style={{ width: 100 }}
                                        >
                                            <InputNumber placeholder="Calories" style={{ width: "100%" }} />
                                        </Form.Item>
                                        <Button danger onClick={() => remove(name)}>Remove</Button>
                                    </div>
                                ))}
                                <Button type="dashed" onClick={() => add()} block>
                                    + Add Dish
                                </Button>
                            </>
                        )}
                    </Form.List>
                </Form>
            </Modal>
            <Footer />
        </div>
    );
};

export default Shop;

