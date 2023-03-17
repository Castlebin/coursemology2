import { FC, useState } from "react";
import AuthenticatedApp from "./AuthenticatedApp";
import UnauthenticatedApp from "./UnauthenticatedApp";

const ActiveApp: FC = () => {
  const [user, setUser] = useState("");
  return <>{user ? <AuthenticatedApp /> : <UnauthenticatedApp />}</>;
};

const App: FC = () => {
  return <ActiveApp />;
};

export default App;
