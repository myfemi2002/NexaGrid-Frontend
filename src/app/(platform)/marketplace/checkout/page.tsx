"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { MarketplaceNavbar } from "@/components/marketplace/marketplace-navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getApiErrorMessage } from "@/services/auth";
import { createMarketplaceOrder } from "@/services/orders";
import { formatCurrency } from "@/lib/utils";
import { useAppStore } from "@/store/use-app-store";

const schema = z.object({
  fullName: z.string().min(2, "Enter your full name."),
  phone: z.string().min(10, "Enter a valid phone number."),
  address: z.string().min(10, "Enter a delivery address."),
  city: z.string().min(2, "Enter your city."),
  state: z.string().min(2, "Enter your state."),
  deliveryType: z.enum(["delivery", "pickup"]),
  paymentMethod: z.enum(["wallet", "card", "bank_transfer"]),
});

type Values = z.infer<typeof schema>;

export default function CheckoutPage() {
  const router = useRouter();
  const cart = useAppStore((state) => state.cart);
  const wishlist = useAppStore((state) => state.wishlist);
  const clearCart = useAppStore((state) => state.clearCart);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [placingOrder, setPlacingOrder] = useState(false);

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      phone: "",
      address: "",
      city: "Redemption City",
      state: "Ogun State",
      deliveryType: "delivery",
      paymentMethod: "wallet",
    },
  });
  const deliveryType = form.watch("deliveryType");

  const summary = useMemo(() => {
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFee = deliveryType === "delivery"
      ? cart.reduce((sum, item) => sum + (item.fastDelivery ? 1200 : 850), 0)
      : 0;
    const transactionFee = 500;
    const total = subtotal + deliveryFee + transactionFee;

    return {
      itemCount,
      subtotal,
      deliveryFee,
      transactionFee,
      total,
    };
  }, [cart, deliveryType]);

  const onSubmit = form.handleSubmit(async (values) => {
    if (cart.length === 0) {
      setSubmitError("Your cart is empty. Add products before checking out.");
      return;
    }

    setSubmitError(null);
    setPlacingOrder(true);

    try {
      const order = await createMarketplaceOrder({
        customer_name: values.fullName,
        customer_phone: values.phone,
        address_line: values.address,
        city: values.city,
        state: values.state,
        payment_method: values.paymentMethod,
        fulfillment_mode: values.deliveryType,
        delivery_fee: summary.deliveryFee,
        items: cart.map((item) => ({
          product_id: Number(item.productId),
          quantity: item.quantity,
        })),
      });

      clearCart();
      router.push(`/marketplace/order-success?orderId=${order.id}`);
    } catch (error) {
      setSubmitError(getApiErrorMessage(error, "We could not place your order right now."));
    } finally {
      setPlacingOrder(false);
    }
  });

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#f6f8fd]">
        <MarketplaceNavbar
          search=""
          onSearchChange={() => undefined}
          onSearchSubmit={() => undefined}
          cartCount={0}
          wishlistCount={wishlist.length}
        />
        <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
          <h1 className="font-['Space_Grotesk',sans-serif] text-4xl font-bold text-[#101827]">Your cart is empty</h1>
          <p className="mt-3 text-sm text-[#607087]">Add products to your cart before opening checkout.</p>
          <Link
            href="/marketplace"
            className="mt-6 inline-flex rounded-full bg-[#003b1b] px-6 py-3 text-sm font-semibold text-white"
          >
            Back to Marketplace
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f8fd]">
      <MarketplaceNavbar
        search=""
        onSearchChange={() => undefined}
        onSearchSubmit={() => undefined}
        cartCount={summary.itemCount}
        wishlistCount={wishlist.length}
      />

      <section className="mx-auto max-w-[1420px] px-4 py-8 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Link
              href="/marketplace/cart"
              className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-[#003b1b]"
            >
              <ArrowLeft className="size-4" />
              Back to Cart
            </Link>
            <h1 className="font-['Space_Grotesk',sans-serif] text-4xl font-bold text-[#101827] sm:text-5xl">
              Secure Checkout
            </h1>
            <p className="mt-2 text-sm text-[#607087] sm:text-base">
              Complete your purchase with verified merchants and protected order handling.
            </p>
          </div>
          <div className="rounded-2xl bg-[#003b1b] px-4 py-3 text-sm text-white">
            <div className="flex items-center gap-2 font-medium">
              <ShieldCheck className="size-4" />
              Escrow Protected
            </div>
            <p className="mt-1 text-xs text-[#d7eedb]">Funds released only after delivery confirmation.</p>
          </div>
        </div>

        <form className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]" onSubmit={onSubmit}>
          <div className="space-y-6">
            <Card className="p-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#003b1b] text-sm font-semibold text-white">1</span>
                <h2 className="font-['Space_Grotesk',sans-serif] text-2xl font-bold text-[#101827]">Delivery Details</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#203447]">Full Name</label>
                  <Input {...form.register("fullName")} placeholder="Enter recipient name" />
                  {form.formState.errors.fullName ? <p className="mt-1 text-xs text-red-600">{form.formState.errors.fullName.message}</p> : null}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#203447]">Phone Number</label>
                  <Input {...form.register("phone")} placeholder="080..." />
                  {form.formState.errors.phone ? <p className="mt-1 text-xs text-red-600">{form.formState.errors.phone.message}</p> : null}
                </div>
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-[#203447]">Address</label>
                  <Input {...form.register("address")} placeholder="House number, street, bus stop" />
                  {form.formState.errors.address ? <p className="mt-1 text-xs text-red-600">{form.formState.errors.address.message}</p> : null}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#203447]">City</label>
                  <Input {...form.register("city")} placeholder="City / LGA" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#203447]">State</label>
                  <Input {...form.register("state")} placeholder="State" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#003b1b] text-sm font-semibold text-white">2</span>
                <h2 className="font-['Space_Grotesk',sans-serif] text-2xl font-bold text-[#101827]">Order Items</h2>
              </div>
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.productId} className="flex gap-4 border-b border-[#e7edf5] pb-4 last:border-0 last:pb-0">
                    <img src={item.image} alt={item.name} className="h-20 w-20 rounded-2xl object-cover" />
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-medium text-[#101827]">{item.name}</p>
                          <p className="mt-1 text-sm text-[#607087]">{item.vendor}</p>
                          <p className="mt-1 text-xs text-[#7d8b9d]">Quantity • {item.quantity}</p>
                        </div>
                        <p className="font-['Space_Grotesk',sans-serif] text-xl font-bold text-[#101827]">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#003b1b] text-sm font-semibold text-white">3</span>
                <h2 className="font-['Space_Grotesk',sans-serif] text-2xl font-bold text-[#101827]">Fulfillment & Payment</h2>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <p className="mb-3 text-sm font-medium text-[#203447]">Fulfillment Mode</p>
                  <div className="grid gap-3">
                    {[
                      { value: "delivery", label: "Home Delivery" },
                      { value: "pickup", label: "Store Pickup" },
                    ].map((option) => (
                      <label key={option.value} className="flex cursor-pointer items-center gap-3 rounded-2xl border border-[#d6dfeb] p-4">
                        <input type="radio" value={option.value} {...form.register("deliveryType")} />
                        <span className="text-sm font-medium text-[#101827]">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-3 text-sm font-medium text-[#203447]">Payment Method</p>
                  <div className="grid gap-3">
                    {[
                      { value: "wallet", label: "Nexa Wallet" },
                      { value: "card", label: "Card Payment" },
                      { value: "bank_transfer", label: "Bank Transfer" },
                    ].map((option) => (
                      <label key={option.value} className="flex cursor-pointer items-center gap-3 rounded-2xl border border-[#d6dfeb] p-4">
                        <input type="radio" value={option.value} {...form.register("paymentMethod")} />
                        <span className="text-sm font-medium text-[#101827]">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="bg-white p-6">
              <h2 className="font-['Space_Grotesk',sans-serif] text-3xl font-bold text-[#101827]">Order Summary</h2>
              <div className="mt-6 space-y-3 text-sm text-[#607087]">
                <div className="flex justify-between"><span>Subtotal ({summary.itemCount} items)</span><span>{formatCurrency(summary.subtotal)}</span></div>
                <div className="flex justify-between"><span>Total Delivery Fee</span><span>{formatCurrency(summary.deliveryFee)}</span></div>
                <div className="flex justify-between"><span>Transaction Fee</span><span>{formatCurrency(summary.transactionFee)}</span></div>
                <div className="flex justify-between border-t border-[#e7edf5] pt-4 text-lg font-semibold text-[#003b1b]"><span>Total</span><span>{formatCurrency(summary.total)}</span></div>
              </div>
              {submitError ? <p className="mt-4 text-sm text-red-600">{submitError}</p> : null}
              <Button className="mt-6 h-14 w-full" disabled={placingOrder}>
                {placingOrder ? "Placing Order..." : "Place Order"}
              </Button>
              <p className="mt-3 rounded-2xl bg-[#f5f8fd] p-4 text-xs text-[#607087]">
                By placing this order, your payment stays protected while NexaGrid coordinates verification and delivery.
              </p>
            </Card>
          </div>
        </form>
      </section>
    </div>
  );
}
