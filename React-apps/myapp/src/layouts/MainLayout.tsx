import type { ReactNode } from "react";
import TopBar from "../components/TopBar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./MainLayout.css";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="layout">
      <TopBar />
      <Header />
      <main className="main-content">{children}</main>
      <Footer />
    </div>
  );
}
