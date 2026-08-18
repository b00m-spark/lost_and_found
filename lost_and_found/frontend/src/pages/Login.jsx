import { Link } from "react-router-dom";
import { useState } from "react";
import { login } from "../services/api.js";
import { useNavigate } from "react-router-dom";

export default function Login({ setCurrentUser }) {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const onChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const userData = await login(loginData);
      const user =
        userData.user ?? (userData.userId ? { id: userData.userId } : null);

      if (!user?.id) {
        throw new Error("Invalid response");
      }

      setCurrentUser(user);
      nav(`/profile/${user.id}`);
    } catch (error) {
      console.error("Erroneous data: ", error);
      setErr("Check the account information you entered and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="loginWrapper">
        <div className="loginCard">
          <h1>Lost & Found</h1>
          <form className="loginForm" action="" onSubmit={handleSubmit}>
            <label for="email">Email</label>
            <input
              type="text"
              id="email"
              name="email"
              placeholder="Enter your email"
              onChange={onChange}
            ></input>
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter password"
              onChange={onChange}
            ></input>
            {err && <div className="errorMessage"> {err}</div>}
            <input
              className="loginSubmit"
              type="submit"
              value="Continue"
            ></input>
          </form>
          <Link className="signupLink" to="/signup">
            Create an account
          </Link>
        </div>
      </div>
    </>
  );
}
