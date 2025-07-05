// src/pages/Register.jsx
import { useForm } from "react-hook-form";

export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log("Registering user:", data);
    // TODO: send to backend
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <h2 className="mb-4">Register</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <label>Username</label>
          <input
            {...register("username", { required: "Username is required" })}
            className="form-control"
          />
          {errors.username && <small className="text-danger">{errors.username.message}</small>}
        </div>

        <div className="mb-3">
          <label>Email address</label>
          <input
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email address"
              }
            })}
            className="form-control"
          />
          {errors.email && <small className="text-danger">{errors.email.message}</small>}
        </div>

        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            {...register("password", { required: "Password is required", minLength: 6 })}
            className="form-control"
          />
          {errors.password && <small className="text-danger">{errors.password.message}</small>}
        </div>

        <button className="btn btn-primary w-100">Register</button>
      </form>
    </div>
  );
}
