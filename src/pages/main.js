import { useState } from "react";
import { Bell, LogOut, User, Heart, X } from "lucide-react";
import { motion } from "framer-motion";
import "../css/main.css";
import sweaterImage from "../images/sweater.jpg";
import headphonesImage from "../images/headphones.jpg";
import pensImage from "../images/pens.jpg";

//hardcode items for testing
const items = [
  { id: 1, name: "Sweater", image: sweaterImage, description: "This is a sweater" },
  { id: 2, name: "Pen", image: pensImage, description: "This is a pen" },
  { id: 3, name: "Headphones", image: headphonesImage, description: "Awesome headphones" },
];

function Card({ children }) {
  return <div className="card">{children}</div>;
}

function CardContent({ children }) {
  return <div className="card-content">{children}</div>;
}

function Button({ onClick, children, className = "" }) {
  return (
    <button onClick={onClick} className={`button ${className}`}>
      {children}
    </button>
  );
}

export default function Main() {
  const [index, setIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleSwipe = (direction) => {
    setSwipeDirection(direction);
    setShowDetails(false);
    setTimeout(() => {
      console.log(direction, items[index].name);
      setIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
      setSwipeDirection(null);
    }, 300);
  };

  return (
    <div className="app-container">
      {/* navbar */}
      <nav className="navbar">
        <div className="profile-section">
          <div className="profile-icon">
            <User className="icon" />
          </div>
          <div className="dropdown">
            <button className="sign-out-button">
              <LogOut className="icon-small" /> Sign Out
            </button>
          </div>
        </div>
        
        <div className="notification-icon" onMouseEnter={() => setShowNotifications(true)} onMouseLeave={() => setShowNotifications(false)}>
          <Bell className="icon" />
          <span className="notification-badge">3</span>

          {/* notif dropdown -- hardcode notifs for testing*/}
          {showNotifications && (
            <div className="notification-dropdown">
              <ul>
                <li>Notif 1</li>
                <li>Notif 2</li>
                <li>Notif 3</li>
              </ul>
            </div>
          )}
        </div>
      </nav>

      {/* swiping item cards */}
      <div className="card-container">
        {items.length > 0 && (
          <motion.div
            key={items[index].id}
            initial={{ opacity: 0, scale: 0.9, x: 0 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              x: swipeDirection === "like" ? 500 : swipeDirection === "dislike" ? -500 : 0,
              rotate: swipeDirection === "like" ? 15 : swipeDirection === "dislike" ? -15 : 0
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="card-wrapper"
            onMouseEnter={() => setShowDetails(true)}
            onMouseLeave={() => setShowDetails(false)}
          >
            <Card>
              <CardContent>
                <img src={items[index].image} alt={items[index].name} className="card-image" />
                <motion.div 
                  className="card-overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: showDetails ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="product-info">
                    <h2>{items[index].name}</h2>
                    <p className="description">{items[index].description}</p>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* like + dislike buttons to swipe */}
        <div className="button-container">
          <Button 
            onClick={() => handleSwipe("dislike")} 
            className="dislike-button"
          >
            <X size={32} />
          </Button>
          <Button 
            onClick={() => handleSwipe("like")} 
            className="like-button"
          >
            <Heart size={32} />
          </Button>
        </div>
      </div>
    </div>
  );
}
