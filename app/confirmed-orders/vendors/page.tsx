import { Suspense } from "react";
import ConfirmedVendorsPage from "./ConfirmedVendorsPage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConfirmedVendorsPage />
    </Suspense>
  );
}
