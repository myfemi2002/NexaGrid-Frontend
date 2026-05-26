"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Product } from "@/types";

export type CartItem = {
  productId: string;
  slug?: string;
  name: string;
  vendor: string;
  vendorSlug?: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  eta: string;
  location: string;
  quantity: number;
  fastDelivery: boolean;
};

export type WishlistItem = Omit<CartItem, "quantity">;
export type CompareItem = WishlistItem & {
  rating: number;
  verified: boolean;
  description: string;
};

type AppState = {
  tenant: string;
  role: string;
  cart: CartItem[];
  wishlist: WishlistItem[];
  compare: CompareItem[];
  setTenant: (tenant: string) => void;
  setRole: (role: string) => void;
  addCartItem: (product: Product, quantity?: number) => void;
  removeCartItem: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
  toggleWishlistItem: (product: Product) => void;
  removeWishlistItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  toggleCompareItem: (product: Product) => void;
  removeCompareItem: (productId: string) => void;
  isInCompare: (productId: string) => boolean;
  clearCompare: () => void;
};

function toCartItem(product: Product, quantity = 1): CartItem {
  return {
    productId: product.id,
    slug: product.slug,
    name: product.name,
    vendor: product.vendor,
    vendorSlug: product.vendorSlug,
    category: product.category,
    price: product.price,
    originalPrice: product.originalPrice,
    image: product.image,
    eta: product.eta,
    location: product.location,
    quantity,
    fastDelivery: product.fastDelivery,
  };
}

function toWishlistItem(product: Product): WishlistItem {
  return {
    productId: product.id,
    slug: product.slug,
    name: product.name,
    vendor: product.vendor,
    vendorSlug: product.vendorSlug,
    category: product.category,
    price: product.price,
    originalPrice: product.originalPrice,
    image: product.image,
    eta: product.eta,
    location: product.location,
    fastDelivery: product.fastDelivery,
  };
}

function toCompareItem(product: Product): CompareItem {
  return {
    ...toWishlistItem(product),
    rating: product.rating,
    verified: product.verified,
    description: product.description,
  };
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      tenant: "Redemption City",
      role: "customer",
      cart: [],
      wishlist: [],
      compare: [],
      setTenant: (tenant) => set({ tenant }),
      setRole: (role) => set({ role }),
      addCartItem: (product, quantity = 1) =>
        set((state) => {
          const productId = product.id;
          const existing = state.cart.find((item) => item.productId === productId);

          if (existing) {
            return {
              cart: state.cart.map((item) =>
                item.productId === productId
                  ? { ...item, quantity: item.quantity + Math.max(1, quantity) }
                  : item
              ),
            };
          }

          return {
            cart: [...state.cart, toCartItem(product, Math.max(1, quantity))],
          };
        }),
      removeCartItem: (productId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.productId !== productId),
        })),
      updateCartQuantity: (productId, quantity) =>
        set((state) => ({
          cart:
            quantity <= 0
              ? state.cart.filter((item) => item.productId !== productId)
              : state.cart.map((item) =>
                  item.productId === productId ? { ...item, quantity } : item
                ),
        })),
      clearCart: () => set({ cart: [] }),
      isInCart: (productId) => get().cart.some((item) => item.productId === productId),
      toggleWishlistItem: (product) =>
        set((state) => {
          const productId = product.id;
          const exists = state.wishlist.some((item) => item.productId === productId);

          return {
            wishlist: exists
              ? state.wishlist.filter((item) => item.productId !== productId)
              : [...state.wishlist, toWishlistItem(product)],
          };
        }),
      removeWishlistItem: (productId) =>
        set((state) => ({
          wishlist: state.wishlist.filter((item) => item.productId !== productId),
        })),
      isInWishlist: (productId) => get().wishlist.some((item) => item.productId === productId),
      toggleCompareItem: (product) =>
        set((state) => {
          const productId = product.id;
          const exists = state.compare.some((item) => item.productId === productId);

          if (exists) {
            return {
              compare: state.compare.filter((item) => item.productId !== productId),
            };
          }

          if (state.compare.length >= 4) {
            return {
              compare: [...state.compare.slice(1), toCompareItem(product)],
            };
          }

          return {
            compare: [...state.compare, toCompareItem(product)],
          };
        }),
      removeCompareItem: (productId) =>
        set((state) => ({
          compare: state.compare.filter((item) => item.productId !== productId),
        })),
      isInCompare: (productId) => get().compare.some((item) => item.productId === productId),
      clearCompare: () => set({ compare: [] }),
    }),
    {
      name: "nexagrid-app-store",
      version: 3,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        tenant: state.tenant,
        role: state.role,
        cart: state.cart,
        wishlist: state.wishlist,
        compare: state.compare,
      }),
      migrate: (persistedState) => {
        const state = persistedState as Partial<AppState> & {
          cart?: Partial<CartItem>[];
          wishlist?: Partial<WishlistItem>[];
          compare?: Partial<CompareItem>[];
        };

        return {
          ...state,
          cart: (state.cart ?? []).filter((item) => {
            if (!item?.productId) {
              return false;
            }

            return !Number.isNaN(Number(item.productId));
          }) as CartItem[],
          wishlist: (state.wishlist ?? []).filter((item) => {
            if (!item?.productId) {
              return false;
            }

            return !Number.isNaN(Number(item.productId));
          }) as WishlistItem[],
          compare: (state.compare ?? []).filter((item) => {
            if (!item?.productId) {
              return false;
            }

            return !Number.isNaN(Number(item.productId));
          }) as CompareItem[],
        };
      },
    }
  )
);
