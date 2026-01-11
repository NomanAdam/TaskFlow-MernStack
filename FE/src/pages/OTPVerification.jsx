import React from "react";
import { useState } from "react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Snackbar,
} from "@mui/material";

const OTPVerification = () => {
  const email = new URLSearchParams(window.location.search).get("email");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);

  const handleVerify = async () => {
    try {
      const res = await fetch("https://taskflow-mernstack.onrender.com/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      setMessage(data.message);
      setOpen(true);

      if (data.status === "success") {
        setTimeout(() => {
          window.location.href = "/";
        }, 1200);
      }
    } catch {
      setMessage("Network error");
      setOpen(true);
    }
  };

  return (
    <div className="auth-container">
      <Card>
        <CardContent>
          <Typography variant="h5">Verify OTP</Typography>

          <TextField
            label="Enter OTP"
            fullWidth
            margin="normal"
            onChange={(e) => setOtp(e.target.value)}
          />

          <Button
            variant="contained"
            style={{ backgroundColor: "#3e3897", color: "white" }}
            onClick={handleVerify}
          >
            Verify
          </Button>
        </CardContent>
      </Card>

      <Snackbar
        open={open}
        message={message}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
      />
    </div>
  );
};

export default OTPVerification;
