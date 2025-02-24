import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/Auth";
import Tasks from "./pages/Tasks";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const auth = getAuth();

const App = () => {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/tasks" /> : <Auth />} />
        <Route path="/tasks" element={user ? <Tasks /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
