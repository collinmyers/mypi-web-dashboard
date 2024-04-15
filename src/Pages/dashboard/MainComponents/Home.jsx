import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Paper,
  useTheme,
  Avatar,
  CardActionArea,
} from "@mui/material";
import { Doughnut } from "react-chartjs-2";
import MapIcon from "@mui/icons-material/Map";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AddAlertIcon from "@mui/icons-material/AddAlert";
import { Chart, ArcElement, PieController, Tooltip, Legend } from "chart.js";
import {
  database,
  DATABASE_ID,
  DASHBOARD_STATS_COLLECTION_ID,
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
    Timestamp: "",
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
          Timestamp: stats.$updatedAt,
        });
        console.log(stats.$updatedAt);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const formatLastUpdated = (time) => {
    const currentTime = new Date();
    const updatedTime = new Date(time);
    const diff = currentTime.getTime() - updatedTime.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) {
      return "now";
    } else if (minutes < 60) {
      return `${minutes} min${minutes > 1 ? "s" : ""} ago`;
    } else if (hours < 24) {
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else {
      return `${days} day${days > 1 ? "s" : ""} ago`;
    }
  };

  const chartData = {
    labels: ["Registered", "Unregistered"],
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
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        {/* Page Title */}
        {/* <Typography
          variant="h3"
          component="h3"
          sx={{ textAlign: "center", mb: 4, color: "#005588" }}
        >
          Platform Statistics
        </Typography> */}

        <Paper
          elevation={5}
          sx={{
            borderRadius: 10, // Adjust the border radius as needed
            padding: theme.spacing(7),
            position: "relative",
          }}
        >
          <Grid container spacing={25}>
            {/* Last updated time component */}
            <Typography
              variant="body2"
              sx={{
                position: "absolute",
                top: theme.spacing(4),
                right: theme.spacing(10),
                color: "#005588",
                fontWeight: 500,
                fontSize: 16,
              }}
            >
              Latest Change: {formatLastUpdated(dashboardStats.Timestamp)}
            </Typography>

            {/* Chart Section */}
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
                    color: "#005588",
                    fontWeight: 500,
                    margin: "2%",
                  }}
                >
                  Total Users
                </div>
                {/* Adjust these values as needed */}
                <Doughnut data={chartData} />
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
                <Card
                  key={index}
                  sx={{ minWidth: "100%", mb: 3, boxShadow: 5 }}
                >
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
        </Paper>
      </Box>
    </Layout>
  );
};

export default Home;
