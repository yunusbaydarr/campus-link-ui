import React, { useState, useEffect, useRef } from 'react';
import './Navbar.css';
import logo from "../assets/logoo.png";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState, AppDispatch } from '../store/store';
import { logout } from '../store/authSlice';
import { dataService } from '../api/dataService';
import { fetchIncomingInvitations } from '../store/invitationSlice'; 

import CreateClubModal from '../components/modals/CreateClubModal';
import CreateEventModal from '../components/modals/CreateEventModal';

import InviteClubSelectModal from '../components/modals/InviteClubSelectModal';
import InviteUserListModal from '../components/modals/InviteUserListModal';

import { NotificationsDropdown } from '../components/modals/NotificationsModal';
import { MessagesDropdown } from '../components/modals/MessagesDropdown';
import { getAllEvents } from '../store/eventSlice'; 
import { getAllClubs } from '../store/clubSlice'; 

const Navbar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const user = useSelector((state: RootState) => state.auth.user);
  const clubs = useSelector((state: RootState) => state.club.clubs);
  const events = useSelector((state: RootState) => state.event.events);

  const { unreadCount } = useSelector((state: RootState) => state.invitation); 


  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showClubModal, setShowClubModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);

  
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);



  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMsgOpen, setIsMsgOpen] = useState(false);

  const [showInviteClubSelect, setShowInviteClubSelect] = useState(false);
  const [showInviteUserList, setShowInviteUserList] = useState(false);
  const [selectedClubIdForInvite, setSelectedClubIdForInvite] = useState<number | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const msgRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (clubs.length === 0) dispatch(getAllClubs());
    if (events.length === 0) dispatch(getAllEvents());
    if (user) dispatch(fetchIncomingInvitations());
  }, [dispatch, user, clubs.length, events.length]);

useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (isMenuOpen && menuRef.current && !menuRef.current.contains(target)) setIsMenuOpen(false);
      if (isNotifOpen && notifRef.current && !notifRef.current.contains(target)) setIsNotifOpen(false);
      if (isMsgOpen && msgRef.current && !msgRef.current.contains(target)) setIsMsgOpen(false);
      
      // Arama sonuçlarını kapat
      if (showSearchResults && searchRef.current && !searchRef.current.contains(target)) {
        setShowSearchResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen, isNotifOpen, isMsgOpen, showSearchResults]);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
        setShowSearchResults(false);
        return;
    }

    const term = searchTerm.toLowerCase();

    const matchedClubs = clubs
        .filter(c => c.name.toLowerCase().includes(term))
        .map(c => ({ ...c, type: 'CLUB' })); 

    const matchedEvents = events
        .filter(e => e.title.toLowerCase().includes(term))
        .map(e => ({ ...e, type: 'EVENT' }));

    setSearchResults([...matchedClubs, ...matchedEvents]);
    setShowSearchResults(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
  };

  const handleResultClick = (item: any) => {
      setShowSearchResults(false);
      setSearchTerm(''); 
      
      if (item.type === 'CLUB') {
          navigate(`/club/${item.id}`);
      } else if (item.type === 'EVENT') {
          navigate(`/event/${item.id}`);
      }
  };

  const defaultProfile = "https://res.cloudinary.com/dejjmja6u/image/upload/v1769038315/tfwichujahdjdmdjpgno.png";
  const profileImage = user?.profilePictureUrl && user.profilePictureUrl.length > 0
      ? user.profilePictureUrl
      : defaultProfile;

  const handleSignOut = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      try {
        await dataService.logout(refreshToken);
      } catch (e) {
        console.error("Logout api error", e);
      }
    }
    dispatch(logout());
    navigate('/login');
    setIsMenuOpen(false);
  };

  const hasClub = clubs.some(c => c.createdByUserId === user?.id);

  const handleClubSelectedForInvite = (clubId: number) => {
    setSelectedClubIdForInvite(clubId);
    setShowInviteClubSelect(false);
    setShowInviteUserList(true);
  };

  const toggleProfile = () => { setIsMenuOpen(!isMenuOpen); setIsNotifOpen(false); setIsMsgOpen(false); };
  const toggleNotif = () => { setIsNotifOpen(!isNotifOpen); setIsMenuOpen(false); setIsMsgOpen(false); };
  const toggleMsg = () => { setIsMsgOpen(!isMsgOpen); setIsMenuOpen(false); setIsNotifOpen(false); };

 return (
    <>
      <nav className="navbar">
        <div className="navbar-brand">
          <img className='navbar-logo' src={logo} alt="" onClick={()=> navigate('/dashboard')}/>
        </div>
        
        <div className='navbar-search-icons-group'>
          <div className="navbar-search" ref={searchRef}>
            <input 
                type="text" 
                placeholder="Search clubs or events..." 
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <button className="search-button" onClick={handleSearch}>🔍</button>

            {showSearchResults && (
                <div className="search-results-dropdown">
                    {searchResults.length === 0 ? (
                        <div className="no-results">No results found for "{searchTerm}"</div>
                    ) : (
                        searchResults.map((item, index) => (
                            <div key={index} className="search-result-item" onClick={() => handleResultClick(item)}>
                                <img 
                                    src={
                                        item.type === 'CLUB' 
                                            ? (item.clubPictureUrl || "https://via.placeholder.com/30?text=C")
                                            : (item.eventPictureUrl || "https://via.placeholder.com/30?text=E")
                                    } 
                                    alt="img" 
                                    className="result-img"
                                />
                                <div className="result-info">
                                    <span className="result-name">{item.type === 'CLUB' ? item.name : item.title}</span>
                                    <span className="result-type">{item.type}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
          </div>

          <div className="navbar-icons">
            
            <div className="icon-container" ref={notifRef}>
                <button className="icon-button" onClick={toggleNotif}>
                    🔔
                    {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
                </button>
                {isNotifOpen && (
                    <div className="dropdown-menu notif-menu">
                        <NotificationsDropdown />
                    </div>
                )}
            </div>

            <div className="icon-container" ref={msgRef}>
                <button className="icon-button" onClick={toggleMsg}>
                    ✉️
                </button>
                {isMsgOpen && (
                    <div className="dropdown-menu msg-menu">
                        <MessagesDropdown />
                    </div>
                )}
            </div>
            
            <div className="profile-container" ref={menuRef}>
              <button className="profile-icon" onClick={toggleProfile}>
                <img src={profileImage} alt="profile" className='profile-pic'/>
              </button>

              {isMenuOpen && (
                <div className="profile-dropdown">
                  <div className="dropdown-header">
                    <strong>{user?.name || "User"}</strong>
                    <small>@{user?.username}</small>
                  </div>
                  <div className="dropdown-divider"></div>
                  
                  <button className="dropdown-item" onClick={() => { setShowClubModal(true); setIsMenuOpen(false); }}>
                    Create Club
                  </button>

                  {hasClub && (
                    <button className="dropdown-item" onClick={() => { setShowEventModal(true); setIsMenuOpen(false); }}>
                      Create Event
                    </button>
                  )}

                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item" onClick={() => { setShowInviteClubSelect(true); setIsMenuOpen(false); }}>
                    Invite to Club
                  </button>
                  
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item sign-out" onClick={handleSignOut}>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div> 
      </nav>

      {showClubModal && <CreateClubModal onClose={() => setShowClubModal(false)} />}
      {showEventModal && <CreateEventModal onClose={() => setShowEventModal(false)} />}
      
      {showInviteClubSelect && (
        <InviteClubSelectModal 
           onClose={() => setShowInviteClubSelect(false)} 
           onClubSelected={handleClubSelectedForInvite} 
        />
      )}

      {showInviteUserList && selectedClubIdForInvite && (
        <InviteUserListModal 
           clubId={selectedClubIdForInvite} 
           onClose={() => setShowInviteUserList(false)} 
        />
      )}
    </>
  );
};

export default Navbar;