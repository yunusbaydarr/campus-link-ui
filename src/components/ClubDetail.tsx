import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../navbar/Navbar';
import Footer from '../Footer/Footer';
import { dataService } from '../api/dataService'
import { getCurrentUserId } from '../utils/authUtils'; // Yukarıdaki helper
import '../css/ClubDetail.css';
import '../css/Dashboard.css'; // Kart stillerini buradan alabiliriz (card-item vb.)

const ClubDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [club, setClub] = useState<any>(null);
  const [creator, setCreator] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'about' | 'events' | 'members'>('about');
  const [loading, setLoading] = useState(true);
  
  const currentUserId = getCurrentUserId(); 

  const fetchClubData = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const clubData = await dataService.getClubById(Number(id));
      setClub(clubData);
      if (clubData.createdByUserId) {
        const creatorArr = await dataService.getUsersByIds([clubData.createdByUserId]);
        setCreator(creatorArr[0]);
      }

      const clubEvents = await dataService.getEventsByClubId(Number(id));
      setEvents(clubEvents);


      const memberIds = await dataService.getClubMembers(Number(id));

      
      
      if (memberIds.length > 0) {
        const usersData = await dataService.getUsersByIds(memberIds);
        setMembers(usersData);
      }
    } catch (error) {
      console.error("Veri çekme hatası:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClubData();
  }, [id]);

  const handleJoinClub = async () => {
    if (!club || !currentUserId) return;
    try {
      await dataService.joinClub(club.id);
setTimeout(() => {
        fetchClubData(); 
      }, 2500);
      fetchClubData(); 
    } catch (error) {
      alert("Kulübe katılırken hata oluştu.");
    }
  };

  if (loading) return <div style={{paddingTop: '100px', textAlign:'center'}}>Loading...</div>;
  if (!club) return <div style={{paddingTop: '100px', textAlign:'center'}}>Club not found.</div>;

  const isJoined = club.memberUserIds?.includes(Number(currentUserId));

  const defaultClubImg = "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop";

  return (
    <div className="detail-page">
      <Navbar/>
      
      <div className="detail-container">
        <div className="detail-header-card">
          <img 
            src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2070&auto=format&fit=crop" 
            alt="Banner" 
            className="banner-image" 
          />
          <div className="header-content">
            <div className="header-left">
              <img 
                src={club.clubPictureUrl || defaultClubImg} 
                alt="Logo" 
                className="club-logo-large" 
              />
              <div className="title-section">
                <h1>{club.name}</h1>
                <p>{members.length} Members</p>
              </div>
            </div>
            
            <button 
              className={`join-btn ${isJoined ? 'disabled' : 'primary'}`}
              onClick={handleJoinClub}
              disabled={isJoined}
            >
              {isJoined ? 'Joined' : 'Join Club'}
            </button>
          </div>
        </div>

        <div className="content-grid">
          
          <div className="main-col">
            <div className="tabs">
              <button className={`tab-btn ${activeTab === 'about' ? 'active' : ''}`} onClick={()=>setActiveTab('about')}>About</button>
              <button className={`tab-btn ${activeTab === 'events' ? 'active' : ''}`} onClick={()=>setActiveTab('events')}>Events</button>
              <button className={`tab-btn ${activeTab === 'members' ? 'active' : ''}`} onClick={()=>setActiveTab('members')}>Members</button>
            </div>

            {activeTab === 'about' && (
              <div className="section-card">
                <h3 className="section-title">About This Club</h3>
                <p className="text-content">{club.description}</p>
              </div>
            )}

            {activeTab === 'events' && (
              <div className="section-card" style={{background: 'transparent', padding: 0, boxShadow: 'none'}}>
                <div style={{display:'flex', flexWrap:'wrap', gap:'20px'}}>
                  {events.length === 0 && <p>No events found.</p>}
                  {events.map(event => (
                    <div className="card-item" key={event.id} style={{width: '48%', flex: 'auto'}}>
                        <div className="card-image-container" style={{height:'140px'}}>
                            <img src={event.eventPictureUrl || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4"} className="card-img" />
                        </div>
                        <div className="card-content">
                            <h3 className="card-title">{event.title}</h3>
                            <button className="action-btn btn-primary" onClick={() => window.location.href = `/event/${event.id}`}>View Event</button>
                        </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'members' && (
               <div className="section-card">
                 <h3 className="section-title">Members</h3>
                 <div className="participants-list">
                    {members.map(member => (
                      <div className="participant-item" key={member.id}>
                        <img src={member.profilePictureUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} className="participant-img" />
                        <span className="participant-name">{member.name}</span>
                      </div>
                    ))}
                 </div>
               </div>
            )}
          </div>

          <div className="side-col">
            <div className="section-card">
               <h3 className="section-title">Organizer</h3>

               {
                creator && (
                   <div className="participant-item" key={creator.id}>
                    <img
      src={
        creator.profilePictureUrl ||
        "https://cdn-icons-png.flaticon.com/512/149/149071.png"
      }
      alt={creator.name}
      className="participant-img"
    />
    <span className="participant-name"> {creator.name}</span>
    </div>
                    )
               }
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ClubDetail;