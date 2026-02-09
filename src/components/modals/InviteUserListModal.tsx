import React, { useEffect, useState } from 'react';
import { dataService } from '../../api/dataService';
import './Modal.css';

interface Props {
  clubId: number;
  onClose: () => void;
}

const InviteUserListModal: React.FC<Props> = ({ clubId, onClose }) => {
  const [users, setUsers] = useState<any[]>([]);
  const [invitedUserIds, setInvitedUserIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const club = await dataService.getClubById(clubId);
        const memberIds = club.memberUserIds || [];

        const allUsers = await dataService.getAllUsers();

        const nonMembers = allUsers.filter((u: any) => !memberIds.includes(u.id));
        setUsers(nonMembers);
      } catch (error) {
        console.error("Error fetching users", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [clubId]);

  const handleInvite = async (userId: number) => {
    try {
      await dataService.sendInvitation(clubId, userId);
      setInvitedUserIds([...invitedUserIds, userId]);
    } catch (error) {
      alert("Invitation failed");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        <h2 className="modal-title">Invite Users</h2>

        <div style={{ maxHeight: '400px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {loading ? <p>Loading users...</p> : (
            users.map(user => (
              <div key={user.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #f0f0f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <img 
                    src={user.profilePictureUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                    style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} 
                  />
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{user.name}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>@{user.username}</div>
                  </div>
                </div>
                
                <button 
                  className="modal-submit-btn" 
                  style={{ marginTop: 0, padding: '8px 20px', fontSize: '14px', backgroundColor: invitedUserIds.includes(user.id) ? '#ccc' : '#0d1e37' }}
                  onClick={() => handleInvite(user.id)}
                  disabled={invitedUserIds.includes(user.id)}
                >
                  {invitedUserIds.includes(user.id) ? 'Invited' : 'Invite'}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default InviteUserListModal;