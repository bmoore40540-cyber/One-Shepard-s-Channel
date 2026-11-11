export type MessageStatus = 'published' | 'notified';

export interface Message {
  id: string;
  user_id: string;
  title: string | null;
  body: string | null;
  practical_next_steps: string | null;
  scripture_anchors: string | null;
  status: MessageStatus;
  contact_agreed: boolean;
  contact_method: string;
  created_at: string;
}
