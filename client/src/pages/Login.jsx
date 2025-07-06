// src/pages/Login.jsx
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  loginStart,
  loginSuccess,
  loginFailure
} from "../redux/userSlice";

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [serverMsg, setServerMsg] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    try {
      dispatch(loginStart());

      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Login failed");
      localStorage.setItem("user", JSON.stringify(result.user));  // ⬅️ ADD THIS
      localStorage.setItem("token", result.token);   
      dispatch(loginSuccess({
        user: result.user,
        token: result.token
      }));

      setServerMsg("✅ Login successful! Redirecting...");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      dispatch(loginFailure(err.message));
      setServerMsg(`❌ ${err.message}`);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <h2 className="mb-4">Login</h2>
      {serverMsg && <div className="alert alert-info">{serverMsg}</div>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <label>Email address</label>
          <input
            type="email"
            {...register("email", { required: true })}
            className="form-control"
          />
          {errors.email && <small className="text-danger">Email is required</small>}
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            {...register("password", { required: true })}
            className="form-control"
          />
          {errors.password && <small className="text-danger">Password is required</small>}
        </div>
        <button className="btn btn-success w-100">Login</button>
      </form>
    </div>
  );
}
