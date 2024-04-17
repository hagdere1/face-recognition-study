'use client'
import { AuthManager } from "./AuthManager";
import LoggedInRoutes from "./components/LoggedInRoutes";
import NavigationProvider from "./NavigationProvider";

export default function App () {
  return (
    <AuthManager>
      <NavigationProvider>
        <LoggedInRoutes />
      </NavigationProvider>
    </AuthManager>
  )
}