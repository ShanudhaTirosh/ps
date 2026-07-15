export type UserRole = 'primary' | 'admin' | 'member' | 'guest';

export interface CommunityUser {
  uid: string;
  username: string;
  displayName: string;
  avatar: string;
  photoURL?: string;
  bio?: string;
  bannerAnimation?: string;
  profileEffect?: string;
  role: UserRole;
  karma: number;
  joinedAt: unknown;
  isGuest?: boolean;
  postsCount: number;
  commentsCount: number;
  joinedChannels: string[];
  savedPosts?: string[];
  blockedUsers?: string[];
  isBanned?: boolean;
  bannedUntil?: unknown;
}

export interface Channel {
  id: string;
  name: string;
  displayName: string;
  icon: string;
  color: string;
  type: 'forum' | 'chat' | 'voice';
  description: string;
  memberCount: number;
  isPrivate: boolean;
  isLocked?: boolean;
  allowedRoles?: UserRole[];
  allowedUids?: string[];
  password?: string;
  createdBy?: string;
  inviteUrl?: string;
  createdAt?: unknown;
}

export interface Notification {
  id: string;
  toUid: string;
  fromUid: string;
  fromName: string;
  type: 'invite' | 'system';
  data: {
    channelId: string;
    channelName: string;
    type: 'voice' | 'chat';
  };
  createdAt: any;
  isRead: boolean;
}

export interface Post {
  id: string;
  channelId: string;
  authorUid: string;
  authorName: string;
  authorAvatar: string;
  title: string;
  body: string;
  image?: string;
  flair?: string;
  upvotes: number;
  downvotes: number;
  commentCount: number;
  reportCount?: number;
  isHidden?: boolean;
  createdAt: unknown;
}

export interface Comment {
  id: string;
  postId: string;
  parentId?: string;
  authorUid: string;
  authorName: string;
  authorAvatar: string;
  body: string;
  image?: string;
  upvotes: number;
  createdAt: unknown;
  replyTo?: {
    id: string;
    authorName: string;
    body: string;
  };
}

export interface ChatMessage {
  id: string;
  authorUid: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  image?: string;
  createdAt: number;
  replyTo?: {
    id: string;
    authorName: string;
    text: string;
    image?: string;
  };
}

export interface InviteToken {
  token: string;
  createdBy: string;
  expiresAt: number;
  isUsed: boolean;
  usedBy?: string;
  createdAt?: number;
}

export interface SiteSettings {
  registrationOpen: boolean;
  guestAccess: boolean;
  siteTitle: string;
}
