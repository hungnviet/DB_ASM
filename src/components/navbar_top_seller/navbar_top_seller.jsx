"use client";
import { useRouter } from "next/navigation";
import "./navbar_top_seller.css";
export default function NavbarTopSeller({ user_id_encode }) {
  const router = useRouter();
  function logOut() {
    router.push(`/homepage/${user_id_encode}`);
  }
  return (
    <div className="navbar_top_seller_container">
      <button className="btn_log_out_seller" onClick={logOut}>
        Log out
      </button>
    </div>
  );
}
