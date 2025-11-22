// /home/mark/Music/my-nextjs-project-clean/lib/types.ts
import { UseFormReturn } from 'react-hook-form';

export interface User {
  _id: string;
  username: string;
  name?: string;
  email?: string;
  chatAvatar?: string;
  chatStatus?: "online" | "offline" | "away";
  lastSeen?: Date | string;
}

export interface Message {
  _id: string;
  sender: string | User;
  text?: string;
  type?: "text" | "image" | "video" | "file" | "media" | "system";
  mediaUrl?: string;
  mediaName?: string;
  chatId: string;
  createdAt: string | Date;
  updatedAt?: string | Date;
  isRead?: boolean;
  status: 'pending' | 'sent' | 'replied' | 'closed' | 'delivered' | 'read';
}

export interface Chat {
  _id: string;
  isGroup: boolean;
  members: User[];
  groupInfo?: { 
    name?: string; 
    photo?: string;
    description?: string;
  };
  lastMessage?: Message;
  unreadCount?: number;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SocketMessage {
  _id: string;
  chatId: string;
  sender: {
    _id: string;
    name: string;
    username?: string;
    chatAvatar?: string;
    chatStatus?: string;
  };
  text: string;
  type: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DropshippingProduct {
  sourceId: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  sku?: string;
  currency: string;
  availability: 'in_stock' | 'out_of_stock';
  region?: string;
  category: string;
  countInStock: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  answer?: string;
  instructions?: string;
  error?: string;
  products?: Array<{
    name: string;
    description?: string;
    price: number;
    category?: string;
    stock?: number;
    currency?: string;
    link?: string;
  }>;
  links?: Array<{ label: string; url: string }>;
  explanation?: string;
  section?: string;
  metadata?: {
    timestamp: string;
    requestId: string;
    version?: string;
  };
}

export interface PaginatedResponse<T> extends ApiResponse {
  data: {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface Seller {
  _id: string ;
  businessName: string;
  logo?: string;
  integrations?: {
    paymentMethods: { name: string; isActive: boolean }[];
    fulfillmentProvider?: { name: string; isActive: boolean };
  };
  wallet: {
    balance: number;
    pendingBalance: number; // الأموال المحجوزة حتى اكتمال الشحن
    commissionRate: number; // نسبة العمولة
  };
}

export interface Product {
  _id: string ;
  name: string;
  description: string;
  pricing: Pricing;
  countInStock: number;
  colors: Array<{ name: string; hex?: string; inStock: boolean }>;
  sizes: string[];
  images: string[];
  category: string;
  brand: string;
  warehouseData: Array<{ sku?: string; location: string }>;
  slug: string;
  sellerId: string ;
  reviews?: Array<{
    userId: string;
    userName: string;
    rating: number;
    comment: string;
    createdAt: Date;
  }>;
  metrics?: { rating: number };
      availability: string;
    isPublished: boolean;

}

export interface MarketplaceProduct {
  title: string;
  description: string;
  price: number;
  sku: string;
  quantity: number;
  images: Array<{ url: string }>;
  categories: string[];
  currency: string;
  region: string;
  sourcePlatform: string;
  sourceId: string;
  sourceStoreId?: string;
  status: string;
  createdAt?: Date;
  createdBy?: string;
  variants: Array<any>;
  options: Array<any>;
  tags: string[];
  attributes: Record<string, any>;
  availability: 'in_stock' | 'out_of_stock';
}

export interface ImportOptions {
  source: 'file' | 'api';
  products?: Array<{
    title: string;
    description?: string;
    price: number;
    sku?: string;
    quantity?: number;
    images?: string[];
    categories?: string[];
    currency?: string;
    sourceId?: string;
    sourceStoreId?: string;
  }>;
  productId?: string;
  region?: string;
}

export interface ImportResult {
  success: boolean;
  products: MarketplaceProduct[];
  stats: {
    total: number;
    imported: number;
    failed: number;
    updated: number;
    skipped: number;
    timeElapsed: number;
  };
}

export interface ExportResult {
  success: boolean;
  data: Partial<MarketplaceProduct>;
  exportedId: string;
  stats: {
    total: number;
    exported: number;
    failed: number;
    timeElapsed: number;
  };
}

export interface IProductInput {
  name: string;
  slug: string;
  category: string;
  images: string[];
  brand: string;
  description: string;
  price: number;
  listPrice: number;
  countInStock: number;
  tags: string[];
  sizes: string[];
  numReviews: number;
  avgRating: number;
  numSales: number;
  weight: number;
  volume: number;
  warehouse: {
    lat: number;
    lon: number;
    quantity: number;
    inStock: boolean;
    sku: string;
  };
  colors: Array<{
    name: string;
    hex: string;
    inStock: boolean;
    sizes?: Array<{
      name: string;
      quantity: number;
      inStock: boolean;
    }>;
  }>;
  warehouseData: Array<{
    warehouseId: string;
    provider: string;
    sku: string;
    quantity: number;
    location: string;
    minimumStock: number;
    reorderPoint: number;
    colors: Array<{
      name: string;
      hex: string;
      quantity: number;
      inStock: boolean;
      sizes: Array<{
        name: string;
        quantity: number;
        inStock: boolean;
      }>;
    }>;
    lastUpdated?: Date;
    updatedBy?: string;
  }>;
  isPublished: boolean;
  status: 'draft' | 'pending' | 'active' | 'rejected';
  pricing: Pricing;
  metrics: {
    views: number;
    sales: number;
    revenue: number;
    returns: number;
    rating: number;
    reviewsCount: number;
  };
  sellerId?: string ;
  seller?: {
    name: string;
    email: string;
    subscription?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}

export interface IUserInput {
  email: string;
  name: string;
  role: 'user' | 'Admin' | 'SELLER';
  image?: string;
  githubId?: string;
  mgzonId?: string;
  profile: {
    nickname?: string;
    avatar?: string;
    status?: string;
    jobTitle?: string;
    bio?: string;
    phone?: string;
    socialLinks?: {
      linkedin?: string;
      behance?: string;
      github?: string;
      whatsapp?: string;
    };
    education?: Array<{ institution: string; degree: string; year: string }>;
    experience?: Array<{ company: string; role: string; duration: string }>;
    certificates?: Array<{ name: string; issuer: string; year: string }>;
    skills?: Array<{ name: string; percentage: number }>;
    projects?: Array<{
      title: string;
      description: string;
      image?: string;
      links?: Array<{ option: string; value: string }>;
    }>;
    interests?: string[];
    isPublic?: boolean;
    customFields?: Array<{ key: string; value: string }>;
    avatarDisplayType?: 'svg' | 'normal';
    svgColor?: string;
    portfolioName?: string;
  };
  refreshTokens: Array<{ token: string; createdAt: Date }>;
}

export interface PointsFormProps {
  id: string;
  form: UseFormReturn<ISettingInput>;
  points: Record<string, any>;
}

export interface ISettingInput {
  availablePaymentMethods: PaymentMethodField[];
  defaultPaymentMethod: PaymentMethodString;
  points: Record<string, any>;
  aiAssistant: {
    price: number;
    description: string;
    image: string;
    enabled: boolean;
    freeLimit: number;
  };
}

export interface PaymentMethodField {
  name: string;
  commission: number;
}

export interface IOrderInput {
  userId: string;
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    countryCode: string;
    postalCode: string;
    phone?: string;
  };
  paymentMethod: PaymentMethodString;
  totalPrice: number;
}

export interface IUserSignIn {
  email: string;
  password: string;
  csrfToken?: string;
}

export interface SellerFormData {
  businessName: string;
  email: string;
  phone: string;
  description?: string;
  businessType: 'individual' | 'company';
  vatRegistered?: boolean;
  logo?: File;
  address: {
    street: string;
    city: string;
    state: string;
    countryCode: string;
    postalCode: string;
  };
  taxId?: string;
  termsAccepted: boolean;
  customSiteUrl?: string;
  is_trial?: boolean;
}

export interface SettingsFormData {
  businessName?: string;
  description?: string;
  email: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state?: string;
    postalCode: string;
    countryCode: string;
  };
  bankInfo?: {
    accountName: string;
    accountNumber: string;
    bankName: string;
    swiftCode: string;
  };
  notifications: {
    email: boolean;
    sms: boolean;
    orderUpdates: boolean;
    marketingEmails: boolean;
    pointsNotifications: boolean;
  };
  display: {
    showRating: boolean;
    showContactInfo: boolean;
    showMetrics: boolean;
    showPointsBalance: boolean;
    [key: string]: any;
  };
  security: {
    twoFactorAuth: boolean;
    loginNotifications: boolean;
    [key: string]: any;
  };
  customSite: {
    theme: string;
    primaryColor: string;
    bannerImage?: string;
    customSections?: string[];
  };
  customSiteUrl?: string;
}

export interface IReviewDetails {
  _id: string;
  title: string;
  comment: string;
  rating: number;
  user: {
    _id: string;
    name: string;
  };
  product: string;
  isVerifiedPurchase: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiKey {
  id: string;
  userId: string;
  name: string;
  key: string;
  secret: string;
  permissions: ApiPermission[];
  createdAt: Date;
  lastUsed?: Date;
  expiresAt?: Date;
  isActive: boolean;
  
}

export type ApiPermission =
  | 'products:read'
  | 'products:write'
  | 'orders:read'
  | 'orders:write'
  | 'customers:read'
  | 'customers:write'
  | 'inventory:read'
  | 'inventory:write'
  | 'analytics:read'
  | 'withdrawals:read'
  | 'withdrawals:write';

export interface WebhookConfig {
  _id?: string;
  userId: string;
  url: string;
  events: WebhookEvent[];
  secret: string;
  isActive: boolean;
  createdAt: Date;
  lastTriggered?: Date;
  lastError?: string;
  retryCount: number;
  headers?: Record<string, string>;
  updatedAt?: Date;
}

export interface FulfillmentOrder {
  orderId: string;
  trackingNumber: string;
  carrier: string;
}

export type WebhookEvent =
  | 'order created'
  | 'order fulfilled'
  | 'order cancelled'
  | 'order payment completed'
  | 'order shipment updated'
  | 'order updated'
  | 'payment succeeded'
  | 'shipment updated'
  | 'tax transaction created'
  | 'tax report created'
  | 'product created'
  | 'product updated'
  | 'product deleted'
  | 'product imported'
  | 'product synced'
  | 'inventory updated'
  | 'customer created'
  | 'customer updated'
  | 'withdrawal created'
  | 'withdrawal updated'
  | 'seller registered'
  | 'seller updated'
  | 'campaign updated'
  | 'ad performance updated'
  | 'transaction recorded'
  | 'analytics updated'
  | 'automation triggered'
  | 'message sent'
  | 'course updated'
  | 'security alert';

export type FulfillmentProvider = string;

export interface FulfillmentConfig {
  provider: FulfillmentProvider;
  apiKey: string;
  apiSecret?: string;
  warehouseId?: string;
  region?: string;
  sandbox?: boolean;
  settings?: Record<string, any>;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface FulfillmentTracking {
  carrier: string;
  trackingNumber: string;
  trackingUrl?: string;
  estimatedDeliveryDate?: string;
  status?: string;
  statusDetails?: string;
  lastUpdated?: string;
}

export interface InventoryLevel {
  sku: string;
  quantity: number;
  warehouseId?: string;
  location?: string;
  lastUpdated: string;
  updatedBy: string;
}

export interface FulfillmentError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
  source?: string;
}

export interface FulfillmentResult {
  success: boolean;
  orderId: string;
  fulfillmentId: string;
  provider: FulfillmentProvider;
  status: FulfillmentStatus;
  tracking?: FulfillmentTracking;
  metadata?: Record<string, any>;
  errors?: FulfillmentError[];
  timestamp: string;
  processedBy: string;
}

export type FulfillmentStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'failed';

export type PaymentMethodString = string;

export interface Notification {
  type: string;
  title: string;
  message: string;
  data?: Record<string, any>;
  channels: ('email' | 'push' | 'sms' | 'in_app')[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'sent' | 'failed' | 'queued' | 'read';
  expiresAt?: Date;
  metadata?: {
    browser?: string;
    device?: string;
    ip?: string;
  };
  read: boolean;
  readAt?: Date;
  queuedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface TimeStamped {
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface WarehouseProvider {
  name: string;
  createShipment: (request: any) => Promise<{ trackingId: string }>;
  getShipmentStatus: (trackingId: string) => Promise<ShipmentStatus>;
  getInventory: (productId: string) => Promise<WarehouseProduct>;
  updateInventory: (productId: string, quantity: number) => Promise<void>;
}

export interface WarehouseProduct {
  id: string;
  sku: string;
  name: string;
  quantity: number;
  location: string;
  totalCount: number;
  outOfStockCount: number;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  currency: string;
  images?: string[];
  sku?: string;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  images?: string[];
  sku?: string;
}

export interface CreateShipmentRequest {
  orderId: string;
  destination: {
    countryCode: string;
    postalCode: string;
    state?: string;
    city: string;
    street: string;
  };
}

export interface ShipmentStatus {
  status: string;
  trackingNumber: string;
  estimatedDelivery?: string;
  trackingId: string;
  statusDetails?: string;
}

export interface ApiKeyRequest {
  name: string;
  permissions?: ApiPermission[];
  expiresAt?: Date;
}

export interface ApiKeyResponse {
  key: string;
  secret: string;
  name: string;
  permissions: ApiPermission[];
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  lastUsed?: Date;
  userId: string;
  id: string;
}

export interface ProductInput {
  metadata: Record<string, string>;
  name: string;
  slug: string;
  description: string;
  price: number;
  listPrice: number;
  countInStock: number;
  category: string;
  brand: string;
  featured: boolean;
  isPublished: boolean;
  pricing: Pricing;
  warehouseData?: WarehouseData[];
  images: string[];
  relatedProducts?: string[];
  dropshipping?: Dropshipping;
  translations: Translation[];
  sections: Section[];
  layout: string;
  tags: string[];
  currency?: string; // Added to support currency from dropshipping
  availability: 'in_stock' | 'out_of_stock'; // Added to match MarketplaceProduct


  sellerId: string;

}

export interface Pricing {
  suggestedMarkup: any;
  basePrice: number;
  markup?: number;
  profit?: number;
  commission?: number;
  finalPrice: number;
  currency: string;
  discount?: Discount;

}

export interface Discount {
  type: 'none' | 'percentage' | 'fixed';
  value?: number;
  startDate?: string;
  endDate?: string;

}

export interface WarehouseData {
  warehouseId: string;
  provider: string;
  location: string;
  sku: string;
  quantity: number;
  minimumStock: number;
  reorderPoint: number;
  variants: Variant[];

}

export interface Variant {
  id: string;
  sku: string;
  barcode: string;
  attributes: {
    color: string;
    size: string;
  };
  priceAdjustment: number;
  stock: number;

}
export interface Supplier {
  status: string;
  id: string;
  name: string;
  address: {
    street: string;
    city: string;
    state?: string;
    countryCode: string;
    postalCode: string;
  };
  contact: {
    email: string;
    phone?: string;
  };
  agreements: {
    terms: string;
    signedAt: string;
  }[];
  type: 'local' | 'international';
  estimatedDeliveryTime: number;
}


export interface Dropshipping {
  provider?: string;
  externalProductId?: string;
  externalSku?: string;
  supplierId?: string; // ربط بالمورد
  purchasePrice?: number; // سعر الشراء من المورد
  estimatedDeliveryTime?: number; // زمن التوصيل المتوقع
  supplyType?: 'local' | 'international';
  supplyNotes?: string;


}


export interface Integration {
  id: string;
  name: string;
  provider: string;
  location?: string;
  logoUrl?: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
}

export interface ShippingProvider {
  id: string;
  name: string;
}

export interface SellerConfigurations {
  warehouses: Integration[];
  paymentMethods: PaymentMethod[];
  shippingProviders: ShippingProvider[];
  dropshippingProviders: Integration[];
}

export interface SellerConfigurationsResponse {
  sellerConfigurations: SellerConfigurations;
}

export interface IntegrationsResponse {
  integrations: Integration[];
}

export interface ProductsResponse {
  products: Product[];
}



export interface State {
  formValues: ProductInput;
  images: string[];
  
  previewUrls: string[];
  categories: string[];
  warehouses: Integration[];
  relatedProducts: { _id: string ; name: string }[];
  dropshippingProviders: Integration[];
  paymentMethods: PaymentMethod[];
  shippingProviders: ShippingProvider[];
  supportedCurrencies: string[];
  layoutOptions: string[];
  maxImages: number;
  sandboxMode: boolean;
  showVendor: boolean;
  isLoadingIntegrations: boolean;
  currency: string;
  suppliers: Supplier[];
  sections: Section[];

  configurations: SellerConfigurationsResponse['sellerConfigurations'];
  integrations: IntegrationsResponse['integrations'];
  // relatedProducts: ProductsResponse['products'];

}

export interface Action {
  type: string;
  payload?: any;
}

export interface ApiKeyRequest {
  name: string;
  permissions?: ApiPermission[];
  expiresAt?: Date;
}

export interface ApiKeyResponse {
  key: string;
  secret: string;
  name: string;
  permissions: ApiPermission[];
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  lastUsed?: Date;
  userId: string;
  id: string;
}



export interface ProductInput {
  metadata: Record<string, string>;
  name: string;
  slug: string;
  description: string;
  price: number;
  listPrice: number;
  countInStock: number;
  category: string;
  brand: string;
  featured: boolean;
  isPublished: boolean;
  pricing: Pricing;
  warehouseData?: WarehouseData[];
  images: string[];
  relatedProducts?: string[];
  dropshipping?: Dropshipping;
  translations: Translation[];
  sections: Section[];
  layout: string;
  tags: string[];
  sellerId: string;
}

export interface Pricing {
  basePrice: number;
  markup?: number;
  profit?: number;
  commission?: number;
  finalPrice: number;
  currency: string;
  discount?: Discount;
}

export interface Discount {
  type: 'none' | 'percentage' | 'fixed';
  value?: number;
  startDate?: string;
  endDate?: string;
}

export interface WarehouseData {
  warehouseId: string;
  provider: string;
  location: string;
  sku: string;
  quantity: number;
  minimumStock: number;
  reorderPoint: number;
  variants: Variant[];
}

export interface Variant {
  id: string;
  sku: string;
  barcode: string;
  attributes: {
    color: string;
    size: string;
  };
  priceAdjustment: number;
  stock: number;
}

export interface Dropshipping {
  provider?: string;
  externalProductId?: string;
  externalSku?: string;
}

export interface Translation {
  locale: string;
  name: string;
  description: string;
}

export interface Section {
  id: string;
  type: string;
  content: {
    text?: string;
    url?: string;
    label?: string;
    endDate?: string;
    images?: string[];
    reviews?: any[];
    [key: string]: string | string[] | any[] | undefined;
  };
  position: number;
}

export interface Integration {
  id: string;
  name: string;
  provider: string;
  location?: string;
  logoUrl?: string;

    providerName: string;
    type: string;
    description?: string;
    connected: boolean;
    status: string;
    lastUpdated?: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
}

export interface ShippingProvider {
  id: string;
  name: string;
}

export interface SellerConfigurations {
  warehouses: Integration[];
  paymentMethods: PaymentMethod[];
  shippingProviders: ShippingProvider[];
  dropshippingProviders: Integration[];
      categories: string[];
    productStatuses: string[];
    dynamicSources: string[];
    layouts: string[];

}

export interface SellerConfigurationsResponse {
  sellerConfigurations: SellerConfigurations;
}

export interface IntegrationsResponse {
  integrations: Integration[];
}

export interface ProductsResponse {
  products: Product[];
}



export interface State {
  formValues: ProductInput;
  images: string[];
  previewUrls: string[];
  categories: string[];
  warehouses: Integration[];
  relatedProducts: { _id: string ; name: string }[];
  dropshippingProviders: Integration[];
  paymentMethods: PaymentMethod[];
  shippingProviders: ShippingProvider[];
  supportedCurrencies: string[];
  layoutOptions: string[];
  maxImages: number;
  sandboxMode: boolean;
  showVendor: boolean;
  isLoadingIntegrations: boolean;
  currency: string;
  sections: Section[];
}

export interface Action {
  type: string;
  payload?: any;
}

export interface ProductFormProps {
  type: 'Create' | 'Edit';
  product?: ProductInput;
  productId?: string;

}

export interface ShippingProvider {
  id: string;
  name: string;
}

export interface SellerConfigurations {
  warehouses: Integration[];
  paymentMethods: PaymentMethod[];
  shippingProviders: ShippingProvider[];
  dropshippingProviders: Integration[];
}

export interface SellerConfigurationsResponse {
  sellerConfigurations: SellerConfigurations;
}

export interface IntegrationsResponse {
  integrations: Integration[];
}

export interface ProductsResponse {
  products: Product[];
}

export interface ImportDropshippingProductResponse {
  importDropshippingProduct: {
    name: string;
    description: string;
    price: number;
    images: string[];
    sku: string;
    currency: string;
    region: string;
    availability: string;
  };
}

export interface State {
  formValues: ProductInput;
  images: string[];
  previewUrls: string[];
  categories: string[];
  warehouses: Integration[];
  relatedProducts: { _id: string ; name: string }[];
  dropshippingProviders: Integration[];
  paymentMethods: PaymentMethod[];
  shippingProviders: ShippingProvider[];
  supportedCurrencies: string[];
  layoutOptions: string[];
  maxImages: number;
  sandboxMode: boolean;
  showVendor: boolean;
  isLoadingIntegrations: boolean;
  currency: string;
  sections: Section[];
}

export interface Action {
  type: string;
  payload?: any;
}

export interface SuppliersResponse {
  suppliers: Supplier[];
}

export interface TrackingData {
  success: boolean;
  trackingUrl?: string;
  status?: string;
  estimatedDeliveryDate?: string;
  carrier?: string;
  error?: string;
}

export interface Order {
  id: string;
  productId: string;
  status: 'pending_supply' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  trackingUrl?: string;
  supplierId?: string;
  createdAt: string;
  amount?: number;
  currency?: string;
}

export interface GetOrdersResponse {
  orders: Order[];
}

export interface UpdateOrderStatusResponse {
  updateOrderStatus: {
    id: string;
    status: string;
  };
}



export interface ClientApplication {
  id: string;
  clientId: string;
  clientSecret: string;
  name: string;
  redirectUris: string[];
  scopes: string[];
  customScopes?: string[];
  description?: string;
  logoUrl?: string;
  videos?: Array<{ url: string; position: 'left' | 'center' | 'right'; size: 'small' | 'medium' | 'large' }>;
  images?: Array<{ url: string; position: 'left' | 'center' | 'right'; size: 'small' | 'medium' | 'large' }>;
  buttons?: Array<{ label: string; link: string; type: 'primary' | 'secondary' | 'link' }>;
  features?: string[];
  categories?: string[];
  slug: string;
  isMarketplaceApp: boolean;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
    pricing?: {
    model: 'free' | 'one-time' | 'subscription';
    amount?: number;
    currency?: 'USD' | 'SAR' | 'EGP';
    interval?: 'monthly' | 'yearly';
  };
}

export interface Template {
  sections?: Array<{
    id: string;
    type: string;
    customHTML?: string;
    customCSS?: string;
    [key: string]: any;
  }>;
  assets?: Array<{ name: string; url: string }>;
  [key: string]: any; // For flexibility, since the schema is validated by Zod
}
