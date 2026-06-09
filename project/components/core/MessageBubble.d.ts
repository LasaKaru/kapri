import * as React from 'react';

/**
 * Chat message bubble for the Kapri concierge. User bubbles are purple and
 * right-aligned; Kapri bubbles are purple-100 with a 🛍️ avatar, left-aligned.
 * Each has a subtle "tail" (squared corner nearest its sender).
 *
 * @startingPoint section="Chat" subtitle="User & Kapri chat bubbles" viewport="700x220"
 */
export interface MessageBubbleProps {
  /** @default "kapri" */
  role?: 'user' | 'kapri';
  /** Use Sinhala font + relaxed line-height for සිංහල/Tanglish. @default false */
  sinhala?: boolean;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export function MessageBubble(props: MessageBubbleProps): React.ReactElement;
