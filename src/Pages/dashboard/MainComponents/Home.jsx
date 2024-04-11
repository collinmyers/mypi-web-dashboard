import React, { useEffect, useState } from "react";
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
import {
  database,
  functions,
  DATABASE_ID,
  DASHBOARD_STATS_COLLECTION_ID,
  DASHBOARD_STATS_FUNCTION_ID,
} from "../../../utils/AppwriteConfig";

Chart.register(ArcElement, PieController, Tooltip, Legend);

const Home = () => {
  const theme = useTheme();

  const [dashboardStats, setDashboardStats] = useState({
    TotalUsers: 0,
    RegisteredUsers: 0,
    TotalEvents: 0,
    TotalPoints: 0,
    TotalNotifications: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await database.listDocuments(
          DATABASE_ID,
          DASHBOARD_STATS_COLLECTION_ID
        );
        const stats = res.documents[0];
        setDashboardStats({
          TotalUsers: stats.TotalUsers,
          RegisteredUsers: stats.RegisteredUsers,
          TotalEvents: stats.TotalEvents,
          TotalPoints: stats.TotalPoints,
          TotalNotifications: stats.TotalNotifications,
        });
        console.log(stats);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const pieData = {
    labels: ["Registered Users", "Unregistered Users"],
    datasets: [
      {
        data: [
          dashboardStats.RegisteredUsers,
          dashboardStats.TotalUsers - dashboardStats.RegisteredUsers,
        ],
        backgroundColor: ["#005588", "#FFB238"],
      },
    ],
  };

  const links = ["/events", "/notifications", "/points-of-interest"];

  const stats = [
    {
      title: "Total Events",
      value: dashboardStats.TotalEvents,
      icon: <AddAlertIcon />,
      color: "#FFB238",
      link: links[0],
    },
    {
      title: "Total Notifications",
      value: dashboardStats.TotalNotifications,
      icon: <CalendarMonthIcon />,
      color: "#FFB238",
      link: links[1],
    },
    {
      title: "Total Points of Interests",
      value: dashboardStats.TotalPoints,
      icon: <MapIcon />,
      color: "#FFB238",
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
            <div style={{ height: "325px", width: "325px" }}>
              <div
                style={{
                  textAlign: "center",
                  fontSize: 20,
                  color: "#0078AA",
                  fontWeight: "bold",
                }}
              >
                Total Users
              </div>
              {/* Adjust these values as needed */}
              <Pie data={pieData} options={{ maintainAspectRatio: false }} />
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
                      sx={{ fontWeight: "medium", color: "#005588" }}
                    >
                      {stat.title}
                    </Typography>

                    <Typography
                      variant="h4"
                      sx={{
                        color: "#005588",
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
