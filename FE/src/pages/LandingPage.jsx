import React from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import SpeedIcon from "@mui/icons-material/Speed";
import DevicesIcon from "@mui/icons-material/Devices";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ bgcolor: "#f4f7fe", minHeight: "100vh" }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
          color: "white",
          pt: 12,
          pb: 15,
          textAlign: "center",
          clipPath: "polygon(0 0, 100% 0, 100% 85%, 0 100%)", // Modern slant
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              mb: 2,
              letterSpacing: -1,
              // Use an object for responsive font sizes
              fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4rem" },
            }}
          >
            Master Your Productivity with{" "}
            <span style={{ color: "#38bdf8" }}>Task Flow</span>
          </Typography>
          <Typography
            variant="h6"
            sx={{ opacity: 0.9, mb: 4, fontWeight: 400 }}
          >
            The ultimate MERN-powered task manager designed for speed,
            organization, and seamless workflow.
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/signup")}
              sx={{
                bgcolor: "white",
                color: "#1e3a8a",
                fontWeight: "bold",
                px: 4,
                "&:hover": { bgcolor: "#e0e7ff" },
              }}
            >
              Get Started for Free
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate("/login")}
              sx={{ color: "white", borderColor: "white", px: 4 }}
            >
              Login
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mt: -8 }}>
        <Grid container spacing={4}>
          {[
            {
              title: "Lightning Fast",
              desc: "Experience zero lag with our optimized MERN stack backend.",
              icon: <SpeedIcon fontSize="large" color="primary" />,
            },
            {
              title: "Drag & Drop",
              desc: "Organize your day effortlessly with intuitive task reordering.",
              icon: <RocketLaunchIcon fontSize="large" color="primary" />,
            },
            {
              title: "Fully Responsive",
              desc: "Access your tasks on desktop, tablet, or mobile perfectly.",
              icon: <DevicesIcon fontSize="large" color="primary" />,
            },
          ].map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  borderRadius: 4,
                  height: "100%",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                  transition: "transform 0.3s",
                  "&:hover": { transform: "translateY(-10px)" },
                }}
              >
                <CardContent sx={{ textAlign: "center", p: 4 }}>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Footer Branding */}
      <Box sx={{ py: 10, textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary">
          © 2026 Task Flow - Built by Noman with MERN Stack
        </Typography>
      </Box>
    </Box>
  );
};

export default LandingPage;
