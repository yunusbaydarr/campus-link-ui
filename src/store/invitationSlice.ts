import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { dataService } from '../api/dataService';

interface Invitation {
  id: number;
  clubId: number;
  fromUserId: number;
  toUserId: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
}

interface InvitationState {
  incomingInvitations: Invitation[];
  unreadCount: number;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: InvitationState = {
  incomingInvitations: [],
  unreadCount: 0,
  status: 'idle',
};

export const fetchIncomingInvitations = createAsyncThunk(
  'invitation/fetchIncoming',
  async () => {
    const response = await dataService.getIncomingInvitations();
    return response || [];
  }
);

export const respondToInvitation = createAsyncThunk(
  'invitation/respond',
  async ({ id, status }: { id: number; status: 'ACCEPTED' | 'REJECTED' }) => {
    await dataService.respondToInvitation(id, status);
    return { id, status };
  }
);

const invitationSlice = createSlice({
  name: 'invitation',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIncomingInvitations.fulfilled, (state, action) => {
        state.incomingInvitations = action.payload;
        state.unreadCount = action.payload.filter((inv: Invitation) => inv.status === 'PENDING').length;
      })
      .addCase(respondToInvitation.fulfilled, (state, action) => {
        const index = state.incomingInvitations.findIndex(inv => inv.id === action.payload.id);
        if (index !== -1) {
          state.incomingInvitations[index].status = action.payload.status;
          state.unreadCount -= 1; 
        }
      });
  },
});

export default invitationSlice.reducer;