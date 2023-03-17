import { FC, useState } from "react";
import { Link } from "react-router-dom";
import { signIn } from "./operations";

const SignInPage: FC = () => {
  const [state, setState] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const handleSubmit = async (e: React.SyntheticEvent) => {
    // Prevent the default form submission behavior
    e.preventDefault();

    try {
      await signIn(state.email, state.password, state.rememberMe);
    } catch (e) {
      return;
    }
  };

  return (
    <>
      <div>Sign In</div>
      <form>
        <div>
          Email:
          <input
            type="text"
            name="email"
            onChange={(e) =>
              setState((value) => {
                return { ...value, email: e.target.value };
              })
            }
          />
        </div>
        <div>
          Password:
          <input
            type="password"
            name="password"
            onChange={(e) =>
              setState((value) => {
                return { ...value, password: e.target.value };
              })
            }
          />
        </div>
        <button type="submit" onClick={handleSubmit}>
          Sign In
        </button>
      </form>
      <Link to={"/"}>Back</Link>
    </>
  );
};

export default SignInPage;
