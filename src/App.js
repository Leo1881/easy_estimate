import "normalize.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";
import CreateRoom from "./components/CreateRoom";
import InvitePage from "./components/InvitePage";
import RoomPage from "./components/RoomPage";

const App = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/create-room" element={<CreateRoom />} />
          <Route
            path="/invite/:roomName/:creatorName"
            element={<InvitePage />}
          />
          <Route path="/room/:roomName/:creatorName" element={<RoomPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
