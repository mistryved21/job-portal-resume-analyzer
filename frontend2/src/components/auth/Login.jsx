import { Input } from "../ui/input";
import { Label } from "../ui/label";
import Navbar from "../shared/Navbar";
import { RadioGroup } from "@radix-ui/react-radio-group";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "@/redux/authSlice";
import { Loader2 } from "lucide-react";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "",
  });

  const { loading, user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!input.role) {
      toast.error("Please select a role (User or Recruiter).");
      return;
    }

    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      console.log("Login API Response:", res.data);

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        navigate("/");
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "An unexpected error occurred. Please try again.");
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center max-w-7xl mx-auto">
        <form
          onSubmit={submitHandler}
          className="w-1/2 border border-gray-200 shadow-lg rounded-lg p-6 my-10 bg-white transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
        >
          <h1 className="font-bold text-xl mb-5 text-center">Login</h1>

          <div className="my-2">
            <label>E-mail</label>
            <Input
              type="email"
              name="email"
              value={input.email}
              onChange={changeEventHandler}
              placeholder="xyz@gmail.com"
              required
              className="transition-all duration-200 ease-in-out border focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            />
          </div>

          <div className="my-2">
            <label>Password</label>
            <Input
              type="password"
              name="password"
              value={input.password}
              onChange={changeEventHandler}
              placeholder="Enter your password"
              required
              className="transition-all duration-200 ease-in-out border focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            />
          </div>

          <div className="my-4">
            <Label>Role</Label>
            <RadioGroup className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Input
                  type="radio"
                  name="role"
                  value="user"
                  checked={input.role === "user"}
                  onChange={changeEventHandler}
                  className="cursor-pointer transition-all duration-200 hover:ring-2 hover:ring-blue-400"
                />
                <Label htmlFor="user" className="cursor-pointer hover:text-blue-500 transition-all">
                  User
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  type="radio"
                  name="role"
                  value="recruiter"
                  checked={input.role === "recruiter"}
                  onChange={changeEventHandler}
                  className="cursor-pointer transition-all duration-200 hover:ring-2 hover:ring-blue-400"
                />
                <Label htmlFor="recruiter" className="cursor-pointer hover:text-blue-500 transition-all">
                  Recruiter
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Link
            className="text-blue-600 underline text-sm hover:text-blue-800 transition-all duration-200"
            to="/forgetpassword"
          >
            Forgot Password?
          </Link>

          {loading ? (
            <Button className="w-full my-4 bg-gray-300 cursor-not-allowed">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait...
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-full my-4 bg-blue-600 hover:bg-blue-700 transition-all duration-200 ease-in-out transform hover:scale-105"
            >
              Login
            </Button>
          )}

          <span className="text-sm flex justify-center">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:text-blue-800 transition-all ml-1">
              Sign Up
            </Link>
          </span>
        </form>
      </div>
    </div>
  );
};

export default Login;
