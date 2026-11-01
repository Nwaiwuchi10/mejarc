"use client";

import CustomerLayout from "@/src/Screens/CustomerLayout/CustomerLayout";
import OrderScreen from "@/src/Screens/Customer/Order/OrderScreen";

export default function OrdersPage() {
  return (
    <CustomerLayout>
      <OrderScreen />
    </CustomerLayout>
  );
}
