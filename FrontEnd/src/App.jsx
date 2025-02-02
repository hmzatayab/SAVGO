import { Route, Routes, useLocation } from "react-router-dom";
import {UserProtectWrapper, UserRedirectWrapper} from "./Components/UserProtectWrapper.jsx";
import { NotificationProvider } from "./context/NotificationContext.jsx";
import { LoginPage } from "./Pages/login";
import { LogoutPage } from "./Pages/Logout";
import { Header } from "./Components/Header";
import { ToastContainer } from "react-toastify";
import { AnimatePresence} from "framer-motion";
import Footer from "./Components/Footer";
import RegisterPage from "./Pages/Register";
import UserProfilePage from "./Pages/UserProfile.jsx";
import ProfilePage from "./Pages/Dashboard.jsx"
import UpdateUser from "./Pages/Update";
import Home from "./Pages/Home";
import ChatPage from "./Pages/ChatRoom";
import Pricing from "./Pages/Pricing.jsx";
import "react-toastify/dist/ReactToastify.css";
import Wishlist from "./Pages/Wishlist.jsx";
import PostDetail from "./Pages/PostDetail.jsx";
import Followers from "./Pages/Followers.jsx";


function App() {
  const location = useLocation();
  const hideHeaderPaths = ["/login", "/register", "/chat", "/update", "/pricing"];


  return(
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      {!hideHeaderPaths.includes(location.pathname) && <Header />}
      <NotificationProvider>
      <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<UserRedirectWrapper><LoginPage/></UserRedirectWrapper>}/>
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/dashboard" element={<UserProtectWrapper><ProfilePage/></UserProtectWrapper>}/>
        <Route path="/profile/:id" element={<UserProfilePage/>}/>
        <Route path="/post/:id" element={<PostDetail></PostDetail>}/>
        <Route path="/update" element={<UserProtectWrapper><UpdateUser/></UserProtectWrapper>}/>
        <Route path="/logout" element={<UserProtectWrapper><LogoutPage/></UserProtectWrapper>}/>
        <Route path="/chat" element={<UserProtectWrapper><ChatPage/></UserProtectWrapper>}/>
        <Route path="/followers/:id" element={<Followers></Followers>}/>
        <Route path="/wishlist" element={<UserProtectWrapper><Wishlist/></UserProtectWrapper>}/>
        <Route path="/pricing" element={<Pricing/>}/>
      </Routes>
      </AnimatePresence>
      </NotificationProvider>
      {!hideHeaderPaths.includes(location.pathname) && <Footer/>}
    </div>
  )
}

export default App;
