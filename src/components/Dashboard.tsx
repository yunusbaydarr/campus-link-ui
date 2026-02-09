import React, { useEffect } from 'react';
import Navbar from '../navbar/Navbar';
import Footer from '../Footer/Footer';
import SectionSlider from './slider/SectionSlider';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store/store';
import { getAllClubs } from '../store/clubSlice';
import { getAllEvents } from '../store/eventSlice';
import '../css/Dashboard.css';
import { useNavigate } from 'react-router-dom';

const DEFAULT_CLUB_IMG = "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop";
const DEFAULT_EVENT_IMG = "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop";

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    
    const { clubs, loading: clubsLoading } = useSelector((state: RootState) => state.club);
    const { events, loading: eventsLoading } = useSelector((state: RootState) => state.event);

    useEffect(() => {
        dispatch(getAllClubs());
        dispatch(getAllEvents());
    }, [dispatch]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
        return { day, month };
    };

    const clubCards = clubs.map(club => (
        <div className="card-item" key={club.id}>
            <div className="card-image-container">
                <img 
                    src={club.clubPictureUrl != null ? club.clubPictureUrl :  DEFAULT_CLUB_IMG} 
                    alt={club.name} 
                    className="card-img" 
                />
            </div>
            <div className="card-content">
                <h3 className="card-title">{club.name}</h3>
                <p className="card-desc">
                    {club.description.length > 130
                        ? club.description.substring(0, 130) + '...' 
                        : club.description}
                </p>
                <button 
                className="action-btn btn-secondary"
                onClick={()=> navigate(`/club/${club.id}`)}
                >
                    View Club
                    </button>
            </div>
        </div>
    ));

    const eventCards = events.map(event => {
        const { day, month } = formatDate(event.date);
        
        const hostClub = clubs.find(c => c.id === event.clubId);

        return (
            <div className="card-item" key={event.id}>
                <div className="card-image-container">
                    <img src={event.eventPictureUrl ?event.eventPictureUrl :DEFAULT_EVENT_IMG} alt={event.title} className="card-img" />
                    <div className="date-badge">
                        <span className="date-day">{day}</span>
                        <span className="date-month">{month}</span>
                    </div>
                </div>
                <div className="card-content">
                    <h3 className="card-title">{event.title}</h3>
                    <p className="card-desc" style={{ marginBottom: '5px' }}>
                        Hosted by {hostClub ? hostClub.name : 'Unknown Club'}
                    </p>
                    <div style={{ marginTop: 'auto' }}>
                        <button 
                        className="action-btn btn-primary"
                        onClick={() => navigate(`/event/${event.id}`)}
                        >View Event</button>
                    </div>
                </div>
            </div>
        );
    });

    if (clubsLoading || eventsLoading) {
        return (
             <div className="dashboard-page" style={{justifyContent:'center', alignItems:'center'}}>
                <div style={{color:'#333', fontSize:'20px'}}>Loading content...</div>
             </div>
        );
    }

    return (
        <div className="dashboard-page">
            <Navbar />
            
            <main className="dashboard-content">
                {clubs.length > 0 ? (
                     <SectionSlider title="All Clubs" items={clubCards} />
                ) : (
                    <div style={{padding: '0 40px', marginBottom: '50px'}}>
                        <h2>No Clubs Found</h2>
                    </div>
                )}

                {events.length > 0 ? (
                    <SectionSlider title="All Events" items={eventCards} />
                ) : (
                    <div style={{padding: '0 40px'}}>
                        <h2>No Events Found</h2>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default Dashboard;