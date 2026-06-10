import { DefaultSession } from "next-auth";

// Extend NextAuth session
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      companyId: string;
      companyName: string;
      avatar?: string | null;
    } & DefaultSession["user"];
  }
}

export type UserRole = "SUPERADMIN" | "OWNER" | "ADMIN" | "SELLER" | "TECHNICIAN" | "SUPPORT";

export type LeadStage =
  | "NEW_LEAD"
  | "CONTACTED"
  | "QUOTED"
  | "NEGOTIATION"
  | "PENDING_PAYMENT"
  | "SOLD"
  | "LOST";

export type CustomerSource =
  | "WHATSAPP"
  | "INSTAGRAM"
  | "MESSENGER"
  | "META_ADS"
  | "WEB"
  | "REFERRAL"
  | "OTHER";

export type SaleStatus = "PAID" | "PENDING" | "PARTIAL" | "CANCELLED";

export type InstallationStatus =
  | "PENDING"
  | "ASSIGNED"
  | "ON_WAY"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export type WarrantyStatus = "ACTIVE" | "EXPIRED" | "VOIDED";

export type WarrantyCaseStatus =
  | "OPEN"
  | "IN_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "RESOLVED";

export type ReturnStatus = "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED";

export type ConversationChannel = "WHATSAPP" | "INSTAGRAM" | "MESSENGER" | "WEB";

export type ConversationStatus = "OPEN" | "CLOSED" | "PENDING";

export type MessageDirection = "INBOUND" | "OUTBOUND";

export type QuoteStatus = "DRAFT" | "SENT" | "ACCEPTED" | "REJECTED";

export type CompanyPlan = "FREE" | "STARTER" | "PROFESSIONAL" | "ENTERPRISE";

// Dashboard types
export interface MetricCard {
  title: string;
  value: string | number;
  change: number;
  changeLabel: string;
  icon: string;
  color: string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface RecentActivity {
  id: string;
  type: "lead" | "sale" | "message" | "installation" | "warranty";
  title: string;
  description: string;
  time: string;
  avatar?: string;
  color: string;
}

// API response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterForm {
  companyName: string;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Customer types
export interface Customer {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  instagram?: string | null;
  address?: string | null;
  city?: string | null;
  source: CustomerSource;
  tags: string[];
  notes?: string | null;
  assignedTo?: string | null;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Product types
export interface Product {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  category?: string | null;
  image?: string | null;
  isAvailable: boolean;
  requiresInstallation: boolean;
  warrantyMonths: number;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Quote item
export interface QuoteItem {
  productId?: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

// Navigation item
export interface NavItem {
  href: string;
  label: string;
  icon: string;
  badge?: number;
  children?: NavItem[];
}
