import { useEffect, useState } from "react";
import { useLoginMutation } from "../../redux/api/userApiSlice";
import { setCredientials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();

  const sp = new URLSearchParams(search);

  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const sumbitHanlder = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      console.log(res);
      dispatch(setCredientials({ ...res }));
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-100 to-pink-200 px-4">
      <div className="bg-white shadow-lg rounded-xl p-10 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-pink-600 mb-6">
          Sign In
        </h1>

        <form onSubmit={sumbitHanlder} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-pink-400 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-pink-400 focus:outline-none"
              value={password}
              onChange={(e) => setpassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>

          <button
            disabled={isLoading}
            type="submit"
            className="w-full bg-pink-500 hover:bg-pink-600 transition-all duration-300 text-white font-semibold py-2 px-4 rounded-md disabled:opacity-50"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>

          {isLoading && <Loader />}
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          New Customer?{" "}
          <Link
            to={redirect ? `/register?redirect=${redirect}` : `/register`}
            className="text-pink-500 hover:underline font-medium"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
