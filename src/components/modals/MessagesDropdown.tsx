// src/components/modals/MessagesDropdown.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import './Modal.css';

export const MessagesDropdown: React.FC = () => {
    const { incomingInvitations } = useSelector((state: RootState) => state.invitation);

    const historyInvites = incomingInvitations.filter(inv => inv.status !== 'PENDING');

    const sorted = [...historyInvites].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    if (sorted.length === 0) return <div className="dropdown-empty">No messages</div>;

    return (
        <div className="notification-list">
            {sorted.map(invite => (
                <div key={invite.id} className="notification-item message-item">
                    <div className="notif-text">
                        {invite.status === 'ACCEPTED' ? '✅ You joined' : '❌ You rejected invitation from'} 
                        {' '} Club #{invite.clubId}
                    </div>
                    <small className="notif-date">{new Date(invite.createdAt).toLocaleDateString()}</small>
                </div>
            ))}
        </div>
    );
};