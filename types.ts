export enum TemplateCategory {
  Portfolio = '作品集',
  ECommerce = '电商零售',
  Blog = '博客资讯',
  Dashboard = '后台管理',
  Landing = '落地页推广'
}

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating';

export interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
  likes: number;
  replies?: {
    user: string;
    isDesigner: boolean;
    content: string;
    date: string;
  }[];
}

export interface Template {
  id: string;
  title: string;
  author: string;
  price: number;
  category: TemplateCategory;
  description: string;
  imageUrl: string;
  tags: string[];
  rating: number;
  downloadCount: number;
  dslCode: string;
  previewUrl: string;
  reviews: Review[];
  demoVideoUrl?: string;
  screenshots?: {
    url: string;
    caption?: string;
    device?: 'desktop' | 'mobile' | 'tablet';
  }[];
  featureHighlights?: {
    title: string;
    description: string;
    mediaUrl: string;
  }[];
  usageSteps?: string[];
  serviceTags?: {
    label: string;
    color: 'green' | 'blue' | 'purple' | 'orange' | 'red';
  }[];
}

export interface AIRecommendationResponse {
  recommendedIds: string[];
  reasoning: string;
}

// --- User & Dashboard Types ---

export interface UserProfile {
  name: string;
  email: string;
  bio: string;
  avatar: string; // Initials or URL
  credits: number;
  expertise?: string[];
  skills?: { name: string; level: number }[];
  socialLinks?: {
    website?: string;
    dribbble?: string;
    twitter?: string;
  };
}

export interface Transaction {
  id: string;
  type: 'recharge' | 'expense';
  amount: number;
  date: string;
  description: string;
}

export interface DownloadRecord {
  id: string;
  templateId: string;
  templateTitle: string;
  date: string;
}