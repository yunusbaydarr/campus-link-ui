import api from "./axiosClient";

export const dataService = {

  /* ---------------- USER ---------------- */

  getUserById: async (id: number) => {
    const res = await api.get(`/user/getUserById/${id}`);
    return res.data;
  },

  getAllUsers: async () => {
    const res = await api.get(`/user/getAllUser`);
    return res.data;
  },

  updateUser: async (payload: any) => {
    const res = await api.put(`/user/updateUser`, payload);
    return res.data;
  },

  getUsersByIds: async (ids: number[]) => {
    const res = await api.post(`/user/users/batch`, ids);
    return res.data;
  },

  createUser: async (formData: FormData) => {
    const res = await api.post(`/user/createUser`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  },

  /* ---------------- CLUB ---------------- */

  getClubById: async (id: number) => {
    const res = await api.get(`/club/getClubById/${id}`);
    return res.data;
  },

  getAllClubs: async () => {
    const res = await api.get(`/club/getAllClubs`);
    return res.data;
  },

  createClub: async (formData: FormData) => {
    const res = await api.post(`/club/createClub`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  },

  updateClub: async (payload: any) => {
    const res = await api.put(`/club/updateClub`, payload);
    return res.data;
  },

  deleteClub: async (clubId: number) => {
    const res = await api.delete(`/club/deleteClub/${clubId}`);
    return res.data;
  },

  joinClub: async (clubId: number) => {
    const res = await api.post(`/club/joinClub/${clubId}`);
    return res.data;
  },

  leaveClub: async (clubId: number) => {
    const res = await api.delete(`/club/leaveClub/${clubId}`);
    return res.data;
  },

  getClubMembers: async (clubId: number) => {
    const res = await api.get(`/club/getClubMembers/${clubId}`);
    return res.data;
  },

  /* ---------------- EVENT ---------------- */

  getEventById: async (id: number) => {
    const res = await api.get(`/event/getEventById/${id}`);
    return res.data;
  },

  getAllEvents: async () => {
    const res = await api.get(`/event/getAllEvents`);
    return res.data;
  },

  getEventsByClubId: async (clubId: number) => {
    const res = await api.get(`/event/getEventsByClubId/${clubId}`);
    return res.data;
  },

  getMyEvents: async () => {
    // userId token’dan alınıyor
    const res = await api.get(`/event/getEventsByUserId`);
    return res.data;
  },

  // createEvent: async (clubId: number, formData: FormData) => {
  //   const res = await api.post(
  //     `/event/createEvent/${clubId}`,
  //     formData,
  //     // {
  //     //   headers: {
  //     //     "Content-Type": "multipart/form-data",
  //     //   },
  //     // }
  //   );
  //   return res.data;
  // },

  // src/api/dataService.ts

    createEvent: async (clubId:number , formData: FormData) => {
    const res = await api.post(`/event/createEvent/${clubId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  },

// createEvent: async (clubId: number, formData: FormData) => {
//     // Sadece URL ve Data
//     const res = await api.post(`/event/createEvent/${clubId}`, formData);
//     return res.data;
// },


  updateEvent: async (payload: any) => {
    const res = await api.put(`/event/updateEvent`, payload);
    return res.data;
  },

  deleteEvent: async (eventId: number) => {
    const res = await api.delete(`/event/deleteEvent/${eventId}`);
    return res.data;
  },

  participateEvent: async (eventId: number) => {
    const res = await api.post(`/event/participateEvent/${eventId}`);
    return res.data;
  },

  cancelParticipation: async (eventId: number) => {
    const res = await api.delete(`/event/cancelParticipation/${eventId}`);
    return res.data;
  },

  getParticipants: async (eventId: number) => {
    const res = await api.get(`/event/getParticipants/${eventId}`);
    return res.data;
  },

  logout: async (refreshToken: string) => {
    const res = await api.post(`/api/v1/auth/logout`, { refreshToken });
    return res.data;
  },


/* ---------------- INVITATION ---------------- */

sendInvitation: async (clubId: number, toUserId: number) => {
  // fromUserId backend'de token'dan alınıyor
  const payload = { clubId, toUserId };
  const res = await api.post(`/invitation/sendInvitation`, payload);
  return res.data;
},

getIncomingInvitations: async () => {
  const res = await api.get(`/invitation/getIncomingInvitations`);
  return res.data;
},

respondToInvitation: async (invitationId: number, status: 'ACCEPTED' | 'REJECTED') => {
  const payload = { status };
  const res = await api.put(`/invitation/respondToInvitation/${invitationId}`, payload);
  return res.data;
},


 };
