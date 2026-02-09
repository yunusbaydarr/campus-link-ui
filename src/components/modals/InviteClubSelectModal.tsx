import React from 'react';
import { useSelector } from 'react-redux';
import type{ RootState } from '../../store/store';
import './Modal.css';

interface Props {
  onClose: () => void;
  onClubSelected: (clubId: number) => void;
}

const InviteClubSelectModal: React.FC<Props> = ({ onClose, onClubSelected }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { clubs } = useSelector((state: RootState) => state.club);

  const myMemberClubs = clubs.filter(c => c.memberUserIds?.includes(user?.id || 0));

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '600px', width: '90%' }}>
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        <h2 className="modal-title">Select a Club to Invite</h2>
        
        <div className="list-container" style={{display:'flex', flexDirection:'column', gap:'10px'}}>
            {myMemberClubs.length === 0 ? (
                <p>You are not a member of any club.</p>
            ) : (
                myMemberClubs.map(club => (
                    <div 
                        key={club.id} 
                        className="card-item" 
                        style={{flexDirection:'row', alignItems:'center', padding:'10px', cursor:'pointer', border:'1px solid #eee'}}
                        onClick={() => onClubSelected(club.id)}
                    >
                        <img 
                            src={club.clubPictureUrl || "https://via.placeholder.com/50"} 
                            style={{width:'50px', height:'50px', borderRadius:'50%', objectFit:'cover', marginRight:'15px'}} 
                        />
                        <h3 style={{margin:0}}>{club.name}</h3>
                    </div>
                ))
            )}
        </div>
      </div>
    </div>
  );
};

export default InviteClubSelectModal;