import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import { LoginPage } from "./Pages/login";
import RegisterPage from "./Pages/Register";
import UploadImage from "./Pages/Upload";
import UpdateUser from "./Pages/Update";
import ProfilePage from "./Pages/Profile";
import { LogoutPage } from "./Pages/Logout";
import UserProtectWrapper from "./Pages/UserProtectWrapper";
import UserRedirectWrapper from "./Pages/UserRedirectWrapper";


function App() {
  return(
    <div>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<UserRedirectWrapper><LoginPage/></UserRedirectWrapper>}/>
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/upload" element={<UserProtectWrapper><UploadImage/></UserProtectWrapper>}/>
        <Route path="/profile" element={<UserProtectWrapper><ProfilePage/></UserProtectWrapper>}/>
        <Route path="/update" element={<UserProtectWrapper><UpdateUser/></UserProtectWrapper>}/>
        <Route path="/logout" element={<UserProtectWrapper><LogoutPage/></UserProtectWrapper>}/>
      </Routes>
    </div>
  )
}

export default App;
