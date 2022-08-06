import axios from "axios";
import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import { Typography, Stack } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import EditableTextField from "./components/EditableTextField";

export default function Profile() {
  const { user } = useAuth0();
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_API_URI + `user/${user.sub}`)
      .then(({ data }) => {
        setUserData(data);
        setLoading(false);
      });
  }, [user]);

  const handleUpdate = async (fieldName, newValue) => {
    return await axios
      .put(process.env.REACT_APP_API_URI + `user/${user.sub}`, {
        [fieldName]: newValue,
      })
      .then((response) => {
        console.log(response.data);
        if (response.data.message) {
          setUserData({ ...userData, [fieldName]: newValue });
          return true;
        }
        return false;
      })
      .catch((error) => false);
  };

  return (
    <Paper sx={{ p: 2, mt: 2, mb: 2 }}>
      <Typography sx={{ mb: 2 }} variant="h6" component="div">
        Profile
      </Typography>
      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <Stack spacing={2} sx={{ maxWidth: 600 }}>
          <EditableTextField
            label="First name"
            content={userData.given_name}
            fieldName="given_name"
            handleUpdate={handleUpdate}
          />
          <EditableTextField
            label="Last name"
            content={userData.family_name}
            fieldName="family_name"
            handleUpdate={handleUpdate}
          />
        </Stack>
      )}
    </Paper>
  );
}
