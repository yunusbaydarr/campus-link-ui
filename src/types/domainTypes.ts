
export interface Club {
  id: number;
  name: string;
  description: string;
  createdByUserId: number;
  memberUserIds: number[];
  clubPictureUrl?: string; 
}

export interface Event {
  id: number;
  title: string;
  description: string;
  date: string; 
  createdByUserId: number;
  eventPictureUrl:string;
  clubId: number;
  participantUserIds: number[];
}