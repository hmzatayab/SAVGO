import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./Pages/Home";
import { LoginPage } from "./Pages/login";
import RegisterPage from "./Pages/Register";
import UploadImage from "./Pages/Upload";
import UpdateUser from "./Pages/Update";
import ProfilePage from "./Pages/Profile";
import { LogoutPage } from "./Pages/Logout";
import {UserProtectWrapper, UserRedirectWrapper} from "./Pages/UserProtectWrapper.jsx";
import ChatPage from "./Pages/ChatRoom";
import { Header } from "./Components/Header";
import Footer from "./Components/Footer";
import { Loader } from "lucide-react";


function App() {
  const location = useLocation();
  const hideHeaderPaths = ["/login", "/register", "/chat", "/update", "/upload"];

  if (false)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  return(
    <div>
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
      </Routes>
      {!hideHeaderPaths.includes(location.pathname) && <Footer/>}
    </div>
  )
}

export default App;
