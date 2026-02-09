import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../navbar/Navbar";
import { dataService } from "../api/dataService";
import { getCurrentUserId } from "../utils/authUtils";
import '../css/ClubDetail.css';

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [hostClub, setHostClub] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const currentUserId = getCurrentUserId();

  const fetchEventData = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const eventData = await dataService.getEventById(Number(id));
      setEvent(eventData);

      const participantIds = await dataService.getParticipants(Number(id));
      if (participantIds.length > 0) {
        const usersData = await dataService.getUsersByIds(participantIds);
        setParticipants(usersData);
      }

      if (eventData.clubId) {
        const clubData = await dataService.getClubById(eventData.clubId);
        setHostClub(clubData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventData();
  }, [id]);

  const handleJoinEvent = async () => {
    if (!event || !currentUserId) return;
    try {
      await dataService.participateEvent(event.id);
      fetchEventData();
    } catch (error) {
      alert("Etkinliğe katılamadınız.");
    }
  };

  if (loading)
    return (
      <div style={{ paddingTop: "100px", textAlign: "center"}}>Loading...</div>
   );
  if (!event)
    return (
      <div style={{ paddingTop: "100px", textAlign: "center" }}>
        Event not found.
      </div>
    );

  const isJoined = event.participantUserIds?.includes(Number(currentUserId));
  const defaultEventImg =
    "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070";
  const defaultLocation = "Campus Main Hall (Example Location)";

  // Tarih Formatlama
  const eventDate = new Date(event.date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="detail-page">
      <Navbar />

      <div className="detail-container">
        <div
          className="detail-header-card"
          style={{
            padding: 0,
            overflow: "hidden",
            position: "relative",
            height: "350px",
          }}
        >
          <img
            src={event.eventPictureUrl ? event.eventPictureUrl: defaultEventImg}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
              background:
                "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
              padding: "30px",
              color: "white",
            }}
          >
            <h1 style={{ fontSize: "36px", margin: 0 }}>{event.title}</h1>
            {hostClub && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "10px",
                  gap: "10px",
                }}
              >
                <span
                  style={{
                    background: "white",
                    color: "black",
                    padding: "2px 8px",
                    borderRadius: "4px",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                >
                  Hosted by
                </span>
                <span>{hostClub.name}</span>
              </div>
            )}
          </div>

          <div style={{ position: "absolute", bottom: "30px", right: "30px" }}>
            <button
              className={`join-btn ${isJoined ? "disabled" : "primary"}`}
              onClick={handleJoinEvent}
              disabled={isJoined}
            >
              {isJoined ? "You are going" : "Join Event"}
            </button>
          </div>
        </div>

        <div className="content-grid">
          <div className="main-col">
            <div className="section-card">
              <h3 className="section-title">Event Info</h3>
              <div style={{ marginBottom: "20px" }}>
                <h2 style={{ margin: 0, color: "#0d1e37" }}>{eventDate}</h2>
                <p style={{ color: "#666" }}>
                  📍 
                 {event.location ? event.location : defaultLocation}
                </p>
              </div>
              <h3 className="section-title">Description</h3>
              <p className="text-content">{event.description}</p>
            </div>

            <div className="section-card">
              <h3 className="section-title">
                Participants ({participants.length})
              </h3>
              <div className="participants-list">
                {participants.map((p) => (
                  <div className="participant-item" key={p.id}>
                    <img
                      src={
                        p.profilePictureUrl ||
                        "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                      }
                      className="participant-img"
                    />
                    <span className="participant-name">{p.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="side-col">
            {hostClub && (
              <div className="section-card" style={{ textAlign: "center" }}>
                <h3 className="section-title">Organized by</h3>
                <img
                  src={
                    hostClub.clubPictureUrl || "https://via.placeholder.com/150"
                  }
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    marginBottom: "10px",
                  }}
                />
                <h4>{hostClub.name}</h4>
                <button
                  className="action-btn btn-secondary"
                  style={{ marginTop: "10px", width: "100%" }}
                  onClick={() =>
                    (window.location.href = `/club/${hostClub.id}`)
                  }
                >
                  View Club
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
