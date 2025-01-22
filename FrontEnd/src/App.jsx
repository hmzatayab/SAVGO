import { Route, Routes, useLocation } from "react-router-dom";
import { Loader } from "lucide-react";
import {UserProtectWrapper, UserRedirectWrapper} from "./Pages/UserProtectWrapper.jsx";
import { LoginPage } from "./Pages/login";
import { LogoutPage } from "./Pages/Logout";
import { Header } from "./Components/Header";
import { ToastContainer } from "react-toastify";
import Footer from "./Components/Footer";
import RegisterPage from "./Pages/Register";
import ProfilePage from "./Pages/Profile";
import UploadImage from "./Pages/Upload";
import UpdateUser from "./Pages/Update";
import Home from "./Pages/Home";
import ChatPage from "./Pages/ChatRoom";
import Pricing from "./Pages/Pricing.jsx";
import "react-toastify/dist/ReactToastify.css";


function App() {
  const location = useLocation();
  const hideHeaderPaths = ["/login", "/register", "/chat", "/update", "/upload", "/pricing"];

  if (false)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  return(
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      {!hideHeaderPaths.includes(location.pathname) && <Header />}
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<UserRedirectWrapper><LoginPage/></UserRedirectWrapper>}/>
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/upload" element={<UserProtectWrapper><UploadImage/></UserProtectWrapper>}/>
        <Route path="/profile" element={<UserProtectWrapper><ProfilePage/></UserProtectWrapper>}/>
        <Route path="/update" element={<UserProtectWrapper><UpdateUser/></UserProtectWrapper>}/>
        <Route path="/logout" element={<UserProtectWrapper><LogoutPage/></UserProtectWrapper>}/>
        <Route path="/chat" element={<UserProtectWrapper><ChatPage/></UserProtectWrapper>}/>
        <Route path="/pricing" element={<Pricing/>}/>
      </Routes>
      {!hideHeaderPaths.includes(location.pathname) && <Footer/>}
    </div>
  )
}

export default App;
