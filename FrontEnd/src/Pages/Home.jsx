import React, { useContext } from 'react'
import { Header } from '../Components/Header'
import { UserDataContext } from "../context/UserContext";

function Home() {
  const { user, setUser } = useContext(UserDataContext);
  console.log(user);
  
  return (
    <Header/>
  )
}

export default Home