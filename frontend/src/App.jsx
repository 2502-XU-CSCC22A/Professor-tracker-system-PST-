// professor-tracker-system/src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/LoginPage";
import ProfessorPage from "./pages/ProfessorPage";
import SearchProfessorPage from "./pages/SearchProfessorPage";
import PrivateRoute from "./components/PrivateRoute";
import MainPage from "./pages/MainPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* root redirects to login */}
        <Route path="/" element={<MainPage />} />

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

        {/* fallback: redirect any unknown path to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
