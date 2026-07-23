import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from "./context/AuthContext";
import App from './app.jsx';
import { Toaster } from "react-hot-toast";
import "./index.css";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="551981807611-kbsns51rokstpua4a85f93m37ecsaiaa.apps.googleusercontent.com">
      <AuthProvider>
        <BrowserRouter>
          <App/>
          <Toaster
              position="top-right"
              reverseOrder={false}
          />
        </BrowserRouter>
      </AuthProvider>
      
    </GoogleOAuthProvider>
  </React.StrictMode>
);
