import { Inter } from "next/font/google";
import NavbarUser from "../../../components/navbar_user/Navbar_user";
import Footer from "@/components/footer/footer";
const inter = Inter({ subsets: ["latin"] });
export const metadata = {
  title: "Database Assignment",
  description: "Generated by create next app",
};

export default function RootLayout({ children, params }) {
  const { user_id_encode } = params;
  const user_id = decodeURIComponent(user_id_encode);
  const totalCartMoney = 100;
  const userName = "Hung Nguyen";
  return (
    <div>
      <NavbarUser user_id={user_id} />
      {children}
      <Footer />
    </div>
  );
}
