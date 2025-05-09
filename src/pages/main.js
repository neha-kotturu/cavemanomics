import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaUpload, FaCommentDots } from 'react-icons/fa';
import Auth from './auth';
import '../css/main.css';

const pullData = (token) => {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64));
    return payload;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

function Home() {
  const navigate = useNavigate();
  const [userID, setUserID] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [direction, setDirection] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const cardRef = useRef(null);

  useEffect(() => {
    const ID = pullData(localStorage.getItem('token'));
    setUserID(ID);
  }, []);

  useEffect(() => {
    if (!userID) return;

    const fetchItems = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/items');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        const filteredItems = data.filter(item => item.poster_id !== userID);
        setItems(filteredItems);
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [userID]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
    setShowProfileMenu(false);
  };

  const handleLike = async () => {
    if (!currentItem) return;
    const likerID = pullData(localStorage.getItem('token'));

    try {
      const response = await fetch('http://localhost:5001/api/swipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          item_id: currentItem.id,
          poster_id: currentItem.poster_id,
          liker_id: likerID,
        }),
      });

      const data = await response.json();

      if (data.match) {
        alert(`You've matched with user ${data.matchedUser}!`);
      }

      setDirection('right');
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        setDirection(null);
      }, 300);
    } catch (error) {
      console.error('Error saving swipe:', error);
    }
  };

  const handleDislike = () => {
    setDirection('left');
    setTimeout(() => {
      setCurrentIndex(currentIndex + 1);
      setDirection(null);
    }, 300);
  };

  const resetCards = () => {
    setCurrentIndex(0);
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  if (loading) {
    return <div className="app">Loading items...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="app">
        <nav className="navbar">
          <div className="nav-left"></div>
          <div className="nav-center">
            <h1 className="logo">Cavemanomics!</h1>
          </div>
          <div className="nav-right">
            <div className="nav-icon-container" onClick={() => navigate("/chatSelection")}>
              <FaCommentDots className="nav-icon" />
            </div>
            <div className="nav-icon-container" onClick={() => navigate('/upload')}>
              <FaUpload className="nav-icon" />
            </div>
            <div className="nav-icon-container" onClick={toggleProfileMenu}>
              <FaUserCircle className="nav-icon" />
              {showProfileMenu && (
                <div className="dropdown-menu profile-menu">
                  <div className="menu-item" onClick={handleLogout}>Logout</div>
                </div>
              )}
            </div>
          </div>
        </nav>
        <div className="no-items-message">
          <h3>No items available from other users</h3>
          <button className="reset-button" onClick={() => navigate('/upload')}>
            Upload an Item
          </button>
        </div>
      </div>
    );
  }

  const currentItem = items[currentIndex];

  const renderItemImage = () => {
    try {
      const itemImage = `http://localhost:5001/uploads/${currentItem.item_url}`;
      if (!itemImage) return <div className="no-image">No Image Available</div>;
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
          <div className="nav-icon-container" onClick={() => navigate("/chatSelection")}>
            <FaCommentDots className="nav-icon" />
          </div>
          <div className="nav-icon-container" onClick={() => navigate('/upload')}>
            <FaUpload className="nav-icon" />
          </div>
          <div className="nav-icon-container" onClick={toggleProfileMenu}>
            <FaUserCircle className="nav-icon" />
            {showProfileMenu && (
              <div className="dropdown-menu profile-menu">
                <div className="menu-item" onClick={handleLogout}>Logout</div>
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
              <div className="card-image">{renderItemImage()}</div>
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
              <button className="reset-button" onClick={resetCards}>Start Over</button>
            </div>
          )}
        </div>

        {currentIndex < items.length && (
          <div className="action-buttons">
            <button className="dislike-button" onClick={handleDislike}>✕</button>
            <button className="like-button" onClick={handleLike}>❤</button>
          </div>
        )}
      </main>
    </div>
  );
}

function AuthMain() {
  return (
    <Auth>
      <Home />
    </Auth>
  );
}

export default AuthMain;
