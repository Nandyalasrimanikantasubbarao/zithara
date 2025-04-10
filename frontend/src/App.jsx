import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navigation from "./pages/auth/Navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Chatbot from "./chatbot/Chatbot";
import chatbotImage from "./assets/chatbotmain-removebg-preview.png";

function App() {
  const [showChatbot, setShowChatbot] = useState(false);

  return (
    <>
      <ToastContainer />
      <Navigation />
      <main className=" bg-pink-200 overflow-hidden  min-h-screen relative">
        <Outlet />
      </main>
      <div className="fixed bottom-4 right-4 flex justify-end p-0 bg-pink-200 rounded-full shadow-lg">
        <img
          onClick={() => setShowChatbot(!showChatbot)}
          src={chatbotImage}
          alt="chatbot"
          className="h-32 w-auto cursor-pointer"
        />
      </div>

      {showChatbot && (
        <div className="fixed bottom-16 right-4 z-50">
          <Chatbot />
        </div>
      )}
      <footer>
        <h2 className=" text-xl font-bold text-center">
          Devloped by Manikanta
        </h2>
        <div className="flex justify-center gap-2 items-center">
          <p className="text-xl">contact</p>
          <a
            className=" text-gray-100 text-xl p-2 bg-lime-600 rounded font-bold"
            href="https://www.srimanikanta.me/"
            target="blank"
          >
            portfolio
          </a>
        </div>
      </footer>
    </>
  );
}

export default App;
