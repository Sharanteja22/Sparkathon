// src/pages/Login.jsx
import { useForm } from "react-hook-form";

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log("Logging in user:", data);
    // TODO: send to backend
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <h2 className="mb-4">Login</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <label>Email address</label>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            className="form-control"
          />
          {errors.email && <small className="text-danger">{errors.email.message}</small>}
        </div>

        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            {...register("password", { required: "Password is required" })}
            className="form-control"
          />
          {errors.password && <small className="text-danger">{errors.password.message}</small>}
        </div>

        <button className="btn btn-success w-100">Login</button>
      </form>
    </div>
  );
}
