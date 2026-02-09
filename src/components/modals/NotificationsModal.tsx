// src/components/modals/NotificationsModal.tsx
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../../store/store';
import { respondToInvitation } from '../../store/invitationSlice';
import { dataService } from '../../api/dataService'; // Veri çekmek için
import { Check, X } from 'lucide-react';
import './Modal.css';

// Detayları tutmak için yerel tipler
interface DetailsCache {
    users: Record<number, { name: string; username: string; profilePictureUrl: string }>;
    clubs: Record<number, { name: string }>;
}

export const NotificationsDropdown: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { incomingInvitations } = useSelector((state: RootState) => state.invitation);
    
    const [details, setDetails] = useState<DetailsCache>({ users: {}, clubs: {} });
    const [loading, setLoading] = useState(false);

    const pendingInvites = incomingInvitations.filter(inv => inv.status === 'PENDING');

    useEffect(() => {
        const fetchDetails = async () => {
            if (pendingInvites.length === 0) return;
            
            setLoading(true);
            const newUsers = { ...details.users };
            const newClubs = { ...details.clubs };
            let hasChanges = false;

            try {
                await Promise.all(pendingInvites.map(async (invite) => {
                    if (!newUsers[invite.fromUserId]) {
                        try {
                            const user = await dataService.getUserById(invite.fromUserId);
                            newUsers[invite.fromUserId] = {
                                name: user.name,
                                username: user.username,
                                profilePictureUrl: user.profilePictureUrl
                            };
                            hasChanges = true;
                        } catch (e) { console.error("User fetch error", e); }
                    }

                    if (!newClubs[invite.clubId]) {
                        try {
                            const club = await dataService.getClubById(invite.clubId);
                            newClubs[invite.clubId] = { name: club.name };
                            hasChanges = true;
                        } catch (e) { console.error("Club fetch error", e); }
                    }
                }));

                if (hasChanges) {
                    setDetails({ users: newUsers, clubs: newClubs });
                }
            } catch (error) {
                console.error("Error fetching notification details", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [pendingInvites.length]); 

    const handleRespond = async (invite: any, status: 'ACCEPTED' | 'REJECTED') => {
        try {
            if (status === 'ACCEPTED') {
                await dataService.joinClub(invite.clubId);
            }

            dispatch(respondToInvitation({ id: invite.id, status }));
            
        } catch (error) {
            console.error("İşlem başarısız:", error);
            alert("Bir hata oluştu. Zaten üye olabilirsiniz.");
        }
    };

    if (pendingInvites.length === 0) {
        return <div className="dropdown-empty">No new notifications</div>;
    }

    return (
        <div className="notification-list">
            {pendingInvites.map(invite => {
                const sender = details.users[invite.fromUserId];
                const club = details.clubs[invite.clubId];
                
                const senderImg = sender?.profilePictureUrl || "https://res.cloudinary.com/dejjmja6u/image/upload/v1769038315/tfwichujahdjdmdjpgno.png";

                return (
                    <div key={invite.id} className="notification-item">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                            <img 
                                src={senderImg} 
                                alt="user" 
                                style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                            <div className="notif-text">
                                {sender ? (
                                    <>
                                        <span style={{ fontWeight: 'bold' }}>{sender.name}</span>
                                        <span style={{ color: '#666', fontSize: '11px' }}> (@{sender.username})</span>
                                        <br />
                                        invites you to <strong>{club?.name || `Club #${invite.clubId}`}</strong> club.
                                    </>
                                ) : (
                                    <span>Loading info...</span>
                                )}
                            </div>
                        </div>

                        <div className="notif-actions">
                            <button className="btn-accept" onClick={() => handleRespond(invite, 'ACCEPTED')} title="Accept & Join">
                                <Check size={16}/>
                            </button>
                            <button className="btn-reject" onClick={() => handleRespond(invite, 'REJECTED')} title="Reject">
                                <X size={16}/>
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};