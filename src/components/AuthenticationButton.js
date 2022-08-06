import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@mui/material";
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <Button onClick={() => loginWithRedirect()} color="inherit" startIcon={<LoginIcon />}>
      Log In
    </Button>
  );
};

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <Button
      onClick={() =>
        logout({ returnTo: process.env.REACT_APP_AUTH0_REDIRECT_URI })
      }
      color="inherit"
      startIcon={<LogoutIcon />}
    >
      Log Out
    </Button>
  );
};

const AuthenticationButton = () => {
  const { isAuthenticated } = useAuth0();

  return isAuthenticated ? <LogoutButton /> : <LoginButton />;
};

export default AuthenticationButton;
