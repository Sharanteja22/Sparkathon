// src/pages/Login.jsx
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [serverMsg, setServerMsg] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Login failed");

      // Save JWT and user info
      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));

      setServerMsg("✅ Login successful! Redirecting to Home...");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
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
