import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./LandingPage";

const AuthenticatedApp = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LandingPage />} path="/" />
      </Routes>
    </BrowserRouter>
  );
};
export default AuthenticatedApp;
