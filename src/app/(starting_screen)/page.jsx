"use client";
import { useRouter } from "next/navigation";
import "./home.css";
export default function Home() {
  const router = useRouter();
  async function handleShopping() {
    router.push("/homepage/guess");
  }
  return (
    <div className="home">
      <div className="content">
        {/* <button onClick={handleShopping}>Shopping</button> */}
      </div>
    </div>
  );
}
