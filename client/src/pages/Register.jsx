// src/pages/Register.jsx
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [serverMsg, setServerMsg] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.error || "Registration failed");

      setServerMsg("✅ Registered successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setServerMsg(`❌ ${err.message}`);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <h2 className="mb-4">Register</h2>
      {serverMsg && <div className="alert alert-info">{serverMsg}</div>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <label>Username</label>
          <input {...register("username", { required: true })} className="form-control" />
          {errors.username && <small className="text-danger">Username is required</small>}
        </div>
        <div className="mb-3">
          <label>Email</label>
          <input type="email" {...register("email", { required: true })} className="form-control" />
          {errors.email && <small className="text-danger">Email is required</small>}
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input type="password" {...register("password", { required: true })} className="form-control" />
          {errors.password && <small className="text-danger">Password is required</small>}
        </div>
        <button className="btn btn-primary w-100">Register</button>
      </form>
    </div>
  );
}
