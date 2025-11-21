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
  dslCode: string;
  previewUrl: string;
  reviews: Review[];
}

export interface AIRecommendationResponse {
  recommendedIds: string[];
  reasoning: string;
}