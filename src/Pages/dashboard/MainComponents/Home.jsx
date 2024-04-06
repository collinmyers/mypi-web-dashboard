import React from "react";
import Layout from "./Layout";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  useTheme,
  Avatar,
  CardActionArea,
} from "@mui/material";
import { Pie } from "react-chartjs-2";
import MapIcon from "@mui/icons-material/Map";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AddAlertIcon from "@mui/icons-material/AddAlert";
import { blue, green, orange } from "@mui/material/colors";
import { Chart, ArcElement, PieController, Tooltip, Legend } from "chart.js";

Chart.register(ArcElement, PieController, Tooltip, Legend);

const Home = () => {
  const theme = useTheme();

  const pieData = {
    labels: ["Total Events", "Total Notifications", "Total Points of Interest"],
    datasets: [
      {
        data: [35, 20, 50],
        backgroundColor: [blue[500], green[500], orange[500]],
      },
    ],
  };

  const links = ["/events", "/notifications", "/points-of-interest"];

  const stats = [
    {
      title: "Total Events",
      value: 35,
      icon: <AddAlertIcon />,
      color: blue[500],
      link: links[0],
    },
    {
      title: "Total Notifications",
      value: 20,
      icon: <CalendarMonthIcon />,
      color: green[500],
      link: links[1],
    },
    {
      title: "Total Points of Interests",
      value: 50,
      icon: <MapIcon />,
      color: orange[500],
      link: links[2],
    },
  ];

  return (
    <Layout>
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Grid container spacing={2}>
          {/* Pie Chart Section */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <div style={{ height: "80%", width: "100%" }}>
              {" "}
              {/* Adjusted for better control */}
              <Pie data={pieData} />
            </div>
          </Grid>

          {/* Cards Section */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {stats.map((stat, index) => (
              <Card key={index} sx={{ minWidth: 345, mb: 2, boxShadow: 5 }}>
                <CardActionArea
                  component="a" // Change to "Link" if using react-router-dom
                  href={stat.link} // Change to "to" if using Link from react-router-dom
                  sx={{ display: "flex", justifyContent: "flex-start" }}
                >
                  <Avatar sx={{ bgcolor: stat.color, ml: 2 }}>
                    {stat.icon}
                  </Avatar>
                  <CardContent>
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{ fontWeight: "medium" }}
                    >
                      {stat.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: theme.palette.primary.main,
                        fontWeight: "bold",
                      }}
                    >
                      {stat.value}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
};

export default Home;
