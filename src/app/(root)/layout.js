import { Inter } from "next/font/google";
import "../globals.css";
import Provider from "../components/Provider";
import Navbar from "../components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Chatty",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50`}>
        <Provider>
          {" "}
          <Navbar />
          {children}
        </Provider>
      </body>
    </html>
  );
}
