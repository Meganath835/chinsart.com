export type ArtworkStatus = "AVAILABLE" | "SOLD" | "PRICE_ON_REQUEST" | "COMMISSION_OPEN";
export type MessageStatus = "UNREAD" | "READ" | "REPLIED";
export type UserRole = "USER" | "ADMIN" | "SUPER_ADMIN";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  _count?: { artworks: number };
  createdAt: string;
  updatedAt: string;
}

export interface ArtworkImage {
  id: string;
  url: string;
  key: string;
  alt?: string | null;
  isPrimary: boolean;
  sortOrder: number;
  artworkId: string;
  createdAt: string;
}

export interface Artwork {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  price?: number | string | null;
  status: ArtworkStatus;
  medium?: string | null;
  dimensions?: string | null;
  year?: number | null;
  featured: boolean;
  tags: string[];
  categoryId?: string | null;
  category?: Category | null;
  images: ArtworkImage[];
  createdAt: string;
  updatedAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location?: string | null;
  content: string;
  rating?: number | null;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string | null;
  message: string;
  status: MessageStatus;
  createdAt: string;
  updatedAt: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  isActive: boolean;
  subscribedAt: string;
}

// API response wrapper
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Pagination
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}

// Gallery filters
export interface GalleryFilters {
  search?: string;
  categorySlug?: string;
  status?: ArtworkStatus;
  sortBy?: "newest" | "oldest" | "title";
  page?: number;
  limit?: number;
}

// Auth
export interface AuthToken {
  userId: string;
  email: string;
  name?: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
