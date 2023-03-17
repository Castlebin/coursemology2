import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./LandingPage";
import SignInPage from "./SignInPage";

const UnauthenticatedApp = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LandingPage />} path="/" />
        <Route element={<SignInPage />} path="/sign_in" />
      </Routes>
    </BrowserRouter>
  );
};
export default UnauthenticatedApp;
