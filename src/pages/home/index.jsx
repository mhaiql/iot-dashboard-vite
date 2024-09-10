import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  Ticks,
} from "chart.js";
import axios from "axios";
import { color } from "chart.js/helpers";
import { FaRegCircleUser } from "react-icons/fa6";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement
);

function HomePage() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const [chartData, setChartData] = useState({
    datasets: [
      {
        borderColor: "rgba(255, 99, 132, 1)", // Warna merah
        borderWidth: 1,
        radius: 0,
        data: [],
      },
    ],
  });

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://api.thingspeak.com/channels/2635960/feeds.json?api_key=DJOGXUUY0XUDPJ70`
      );
      const feeds = response.data.feeds;

      let previousY = 0;
      const newData = feeds.map((feed, index) => {
        const y = feed.field1 ? parseFloat(feed.field1) : previousY - 1; // Turun jika tidak ada data
        previousY = y;
        return { x: index, y }; // Format untuk chart.js
      });

      // Mengubah state chartData dengan data baru
      setChartData({
        datasets: [
          {
            borderColor: "#21ab72", // Warna garis line chart
            borderWidth: 1,
            radius: 0,
            data: newData,
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const options = {
    maintainAspectRatio: false,
    animation: {
      x: {
        type: "number",
        easing: "linear",
        duration: 3000,
      },
      y: {
        type: "number",
        easing: "linear",
        duration: 3000,
      },
    },
    interaction: {
      intersect: false,
    },
    plugins: {
      legend: {
        display: false, // Tidak menampilkan legenda
      },
    },
    scales: {
      x: {
        type: "linear",
        grid: {
          color: "#4B5563",
        },
        ticks: {
          color: "#F9FAFB",
        },
      },
      y: {
        min: 0, // Minimum value for Y-axis
        max: 100, // Maximum value for Y-axis
        ticks: {
          color: "#F9FAFB",
          stepSize: 20, // Set step size for Y-axis ticks (0, 20, 40, 60, 80, 100)
        },
        grid: {
          color: "#4B5563",
        },
      },
    },
  };

  const doughnutOptions = {
    cutout: "70%",
  };

  const [doughnutData] = useState({
    labels: ["Online", "Offline 1 Jam", "Offline 7 Jam", "Offline 24 Jam"],
    datasets: [
      {
        label: "Status",
        data: [20, 12, 6, 2], // Contoh data untuk doughnut chart
        backgroundColor: [
          "#21ab72", // Warna untuk Online
          "#f9c74f", // Warna untuk Offline 1 Jam
          "#f8961e", // Warna untuk Offline 7 Jam
          "#ef476f", // Warna untuk Offline 24 Jam
        ],
        borderRadius: 0,
        borderWidth: 0,
        spacing: 0,
      },
    ],
  });

  return (
    <>
      <div className="bg-zinc-950 h-screen w-screen px-8">
        <div className="flex w-full border-b-2 border-zinc-800 py-6 mb-8">
          <p className="text-3xl text-zinc-200 rounded-lg w-fit flex-grow">
            Admin Dashboard
          </p>

          <div className="flex items-center  justify-center px-8 rounded-lg mx-8 space-x-2">
            <FaRegCircleUser className="text-zinc-400" />
            <p className=" text-zinc-200 w-fit">Hello, Admin!</p>
          </div>
          <p className="flex text-[#ef476f] rounded-lg w-fit ring-1 ring-[#ef476f] px-8 justify-center items-center cursor-pointer hover:ring-red-400 hover:text-red-400 duration-100">
            Logout
          </p>
        </div>

        {/* CONTAINER LINE CHART & PIE CHART */}
        <div className="flex space-x-8">
          {/* CONTAINER LINE CHART & 4 CARDS */}
          <div className="w-3/4">
            {/* 4 CARDS */}
            <div className="flex space-x-4 w-full mb-8">
              <Card sx={{ borderRadius: "16px" }} className="flex-grow w-28">
                <CardContent className="bg-zinc-900/95">
                  <p className="text-xl pb-4 text-zinc-200">Online</p>
                  <p className="text-5xl text-zinc-200">20</p>
                </CardContent>
              </Card>

              <Card sx={{ borderRadius: "16px" }} className="flex-grow w-28">
                <CardContent className="bg-zinc-900/95">
                  <p className="text-xl pb-4 text-zinc-200">Offline 1 Jam</p>
                  <p className="text-5xl text-zinc-200">12</p>
                </CardContent>
              </Card>

              <Card sx={{ borderRadius: "16px" }} className="flex-grow w-28">
                <CardContent className="bg-zinc-900/95">
                  <p className="text-xl pb-4 text-zinc-200">Offline 7 Jam</p>
                  <p className="text-5xl text-zinc-200">6</p>
                </CardContent>
              </Card>

              <Card sx={{ borderRadius: "16px" }} className="flex-grow w-28">
                <CardContent className="bg-zinc-900/95">
                  <p className="text-xl pb-4 text-zinc-200">Offline 24 Jam</p>
                  <p className="text-5xl text-zinc-200">2</p>
                </CardContent>
              </Card>
            </div>

            {/* LINE CHART */}
            <div>
              <div className="mt-4 items-center bg-zinc-950">
                {/* Line Chart dalam Card (Activity Overview) */}

                <Card
                  className="flex flex-col h-[300px]"
                  sx={{ borderRadius: "16px" }}
                >
                  <CardContent className="flex flex-col flex-grow h-full p-0 bg-zinc-900/95">
                    <div className="mb-4">
                      <p className="text-xl text-zinc-200">Activity Overview</p>
                    </div>
                    <div className="flex-grow h-full">
                      <Line
                        data={chartData}
                        options={options}
                        className="h-full"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* PIE CHART */}
          <div className="w-1/4">
            <Card
              className="h-full bg-zinc-950/95"
              sx={{ borderRadius: "16px" }}
            >
              <CardContent className="flex-grow-1 bg-zinc-900/95 h-full">
                <p className=" text-white text-xl">Status Overview</p>
                <div className="h-full p-8">
                  <Doughnut
                    options={doughnutOptions}
                    data={doughnutData}
                    className="w-full h-full"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Status Online, Offline dalam 2 kolom sejajar dengan Doughnut Chart */}

        {/* Doughnut Chart dalam Card (Status Overview) */}
      </div>
    </>
  );
}

export default HomePage;
