import React, { useState, useEffect, useRef } from 'react';
import Auth from './auth';
import '../css/main.css';

const App = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [direction, setDirection] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const cardRef = useRef(null);

  // fetch the items from the api
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('/api/items');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  // like items
  const handleLike = () => {
    if (currentIndex < items.length - 1) {
      setDirection('right');
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        setDirection(null);
      }, 300);
    } else {
      // handle last item -- no more items left
      setDirection('right');
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        setDirection(null);
      }, 300);
    }
  };

  // dislike item
  const handleDislike = () => {
    if (currentIndex < items.length - 1) {
      setDirection('left');
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        setDirection(null);
      }, 300);
    } else {
      // handle last item -- no more items left
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

  // profile menu 
  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
    if (showNotifications) setShowNotifications(false);
  };

  // notifications menu
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (showProfileMenu) setShowProfileMenu(false);
  };

  if (loading) {
    return <div className="app">Loading items...</div>;
  }

  if (items.length === 0) {
    return <div className="app">No items found</div>;
  }

  const currentItem = items[currentIndex];

  const renderItemImage = () => {
    try {
      const itemImage = currentItem.item_url;
      
      if (!itemImage) {
        return <div className="no-image">No Image Available</div>;
      }
  
      if (typeof itemImage === 'string') {
        return <img src={itemImage} alt={currentItem.item_name} className="item-image" />;
      }
  
      return <div className="no-image">No Image Available</div>;
    } catch (error) {
      console.error('Error rendering image:', error);
      return <div className="no-image">Error loading image</div>;
    }
  };

  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-left"></div>
        <div className="nav-center">
          <h1 className="logo">Cavemanomics!</h1>
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
                {renderItemImage()}
              </div>
              <div className="card-info">
                <h2>{currentItem.item_name}</h2>
                <p className="item-desc">{currentItem.item_description}</p>
                {currentItem.poster_name && (
                  <p className="poster-info">Posted by: {currentItem.poster_name}</p>
                )}
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

function AuthMain() {
  return (  
    <Auth>
      <App />
    </Auth>
  );
}

export default AuthMain;