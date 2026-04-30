// professor-tracker-system/src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/LoginPage";
import ProfessorPage from "./pages/ProfessorPage";
import SearchProfessorPage from "./pages/SearchProfessorPage";
import PrivateRoute from "./components/PrivateRoute";
import MainPage from "./pages/MainPage";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
       
        <Route path="/" element={<MainPage />} />
        <Route
              path="/admin"
              element={
                <PrivateRoute>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />

        {/* public */}
        <Route path="/login" element={<Login />} />

        {/* protected */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <ProfessorPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/search-professor"
          element={<SearchProfessorPage />}
        />

        {/* redirect any unknown path to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
