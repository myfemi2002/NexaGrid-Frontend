import { api, ensureCsrfCookie } from "@/services/api";

type OrderItemPayload = {
  product_id: number;
  quantity: number;
};

type CreateOrderPayload = {
  customer_name: string;
  customer_phone: string;
  address_line?: string;
  city?: string;
  state?: string;
  payment_method: string;
  fulfillment_mode: "delivery" | "pickup";
  delivery_fee?: number;
  items: OrderItemPayload[];
};

type OrderResponse = {
  success: boolean;
  message?: string;
  data: {
    id: number;
    order_number: string;
    status: string;
    fulfillment_mode: string;
    meta?: {
      customer_name?: string;
      customer_phone?: string;
      address_line?: string | null;
      city?: string | null;
      state?: string | null;
      payment_method?: string;
    } | null;
    totals: {
      subtotal: number | string;
      delivery_fee: number | string;
      discount_total: number | string;
      grand_total: number | string;
    };
    delivery?: {
      status?: string | null;
      tracking_code?: string | null;
      eta_minutes?: number | null;
      meta?: {
        hub?: string;
      } | null;
    } | null;
    items: Array<{
      id: number;
      product_id: number;
      product_name?: string | null;
      image_url?: string | null;
      quantity: number;
      unit_price: number | string;
      line_total: number | string;
    }>;
  };
};

export type MarketplaceOrder = OrderResponse["data"];

type OrdersListResponse = {
  data: MarketplaceOrder[];
  links?: {
    first?: string | null;
    last?: string | null;
    prev?: string | null;
    next?: string | null;
  };
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
};

export async function createMarketplaceOrder(payload: CreateOrderPayload): Promise<MarketplaceOrder> {
  await ensureCsrfCookie();

  const response = await api.post<OrderResponse>("/v1/orders", payload);

  return response.data.data;
}

export async function fetchMarketplaceOrder(orderId: string | number): Promise<MarketplaceOrder> {
  const response = await api.get<OrderResponse>(`/v1/orders/${orderId}`);

  return response.data.data;
}

export async function fetchMarketplaceOrders(page = 1): Promise<{
  orders: MarketplaceOrder[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}> {
  const response = await api.get<OrdersListResponse>("/v1/orders", {
    params: { page },
  });

  return {
    orders: response.data.data,
    pagination: {
      current_page: response.data.meta?.current_page ?? 1,
      last_page: response.data.meta?.last_page ?? 1,
      per_page: response.data.meta?.per_page ?? response.data.data.length,
      total: response.data.meta?.total ?? response.data.data.length,
    },
  };
}
