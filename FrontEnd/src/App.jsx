import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import { LoginPage } from "./Pages/login";
import RegisterPage from "./Pages/Register";
import UploadImage from "./Pages/Upload";

function App() {
  return(
    <div>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/upload" element={<UploadImage/>}/>
      </Routes>
    </div>
  )
}

export default App;
