import { Outlet } from "react-router";
import Header from "./Homepage Pages/Header";
export default function AdminPage() {
  return (
    <>
      <Header/>
      <Outlet/>
    </>
  );
}
