import React, { useState, useEffect, useRef } from 'react';
import '../css/main.css';

//import images
import headphones from '../images/headphones.jpg';
import pens from '../images/pens.jpg';
import sweater from '../images/sweater.jpg';

// Manual testing -- hardcode items
const items = [
  { id: 1, name: "Headphones", desc: "Fire beats", image: headphones },
  { id: 2, name: "Pens", desc: "Nice pens", image: pens },
  { id: 3, name: "Sweater", desc: "Warm sweater", image: sweater },
];

const App = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [direction, setDirection] = useState(null);
  const cardRef = useRef(null);

  // Like item
  const handleLike = () => {
    if (currentIndex < items.length - 1) {
      setDirection('right');
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        setDirection(null);
      }, 300);
    } else {
      // Handle the last item -- no more items left
      setDirection('right');
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        setDirection(null);
      }, 300);
    }
  };

  // Dislike item
  const handleDislike = () => {
    if (currentIndex < items.length - 1) {
      setDirection('left');
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        setDirection(null);
      }, 300);
    } else {
      // Handle the last item -- no more items left
      setDirection('left');
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        setDirection(null);
      }, 300);
    }
  };

  const resetCards = () => {
    setCurrentIndex(0);
  };

  // Profile menu
  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
    if (showNotifications) setShowNotifications(false);
  };

  // Notifications menu
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (showProfileMenu) setShowProfileMenu(false);
  };

  const currentItem = items[currentIndex];

  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-left"></div>
        <div className="nav-center">
          <h1 className="logo">Cavemanomics</h1>
        </div>
        <div className="nav-right">
          <div className="nav-icon-container">
            <div className="notification-icon" onClick={toggleNotifications}>
              <i className="notification-bell">🔔 </i>
              <span className="notification-badge">1</span>
            </div>
            {showNotifications && (
              <div className="dropdown-menu notification-menu">
                <div className="notification-item">
                  <strong>User 3:</strong> Swiped on your buds!
                </div>
              </div>
            )}
          </div>
          <div className="nav-icon-container">
            <div className="profile-icon" onClick={toggleProfileMenu}>
              <i className="profile-avatar"> 👤 </i>
            </div>
            {showProfileMenu && (
              <div className="dropdown-menu profile-menu">
                <div className="menu-item">Logout</div>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="main-content">
        <div className="card-container">
          {currentIndex < items.length ? (
            <div
              ref={cardRef}
              className={`card ${direction ? `swipe-${direction}` : ''}`}
            >
              <div className="card-image">
                <img src={currentItem.image} alt={currentItem.name} />
              </div>
              <div className="card-info">
                <h2>{currentItem.name}</h2>
                <p className="item-desc">{currentItem.desc}</p>
              </div>
            </div>
          ) : (
            <div className="no-more-cards">
              <h3>No more items to show</h3>
              <button className="reset-button" onClick={resetCards}>
                Start Over
              </button>
            </div>
          )}
        </div>

        {currentIndex < items.length && (
          <div className="action-buttons">
            <button className="dislike-button" onClick={handleDislike}>
              ✕
            </button>
            <button className="like-button" onClick={handleLike}>
              {'❤'}
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
