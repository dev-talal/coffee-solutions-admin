export interface InboxMessage {
  id: number;
  type: 'sender' | 'receiver';
  text?: string;
  images?: string[];
  document?: string;
}
