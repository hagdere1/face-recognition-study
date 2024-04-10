'use client'
import { useState } from "react";
import Login from "./components/Login";
import Routes from "./components/Routes";

type User = {
  email: string,
  role: string,
  group: string,
  step: number,
  results: {
    preTrial: [],
    trial1: [],
    trial2: [],
    postTrial: []
  }
}

export default function App() {
  const [user, setUser] = useState<User>()

  if (!user) {
    return <Login setUser={setUser} />
  }
  return <Routes currentPage={user.step} />
}