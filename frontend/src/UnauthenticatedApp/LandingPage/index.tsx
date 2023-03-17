import { FC, useState } from "react";
import { Link } from "react-router-dom";

const LandingPage: FC = () => {
  return (
    <>
      <div>Landing Page (Logged out)</div>
      <Link to={"/sign_in"}>Sign in</Link>
    </>
  );
};

export default LandingPage;
