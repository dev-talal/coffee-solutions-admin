export interface userType {
  id: string;
  first_name: string;
  last_name: string;
  profile: string;
}

export interface MessageType {
  id: number;
  room_id: number;
  sender_id: number;
  message?: string;
  media?: {
    file: string;
    file_name: string;
    type: string;
  }[];
  created_at: string;
  updated_at: string;
}

export interface ChatRoomData {
  id: string;
  customer_care_agent: userType;
  room_name: string;
  user: userType;
  last_message: MessageType;
  unread_messages_count: number;
  createdAt: string;
  updatedAt: string;
}

export type PostMessagePayload = {
  room_id: string;
  message: string;
  media?: {
    url: string;
    name: string;
    type: string;
  }[];
};
