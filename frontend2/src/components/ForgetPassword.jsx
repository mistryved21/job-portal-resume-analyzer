import { USER_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const sendOtp = async () => {
    try {
      const response = await axios.post(`${USER_API_END_POINT}/send-otp`, { email });

      if (response.data.success) {
        setStep(2);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Error sending OTP");
    }
  };

  const verifyOtpAndResetPassword = async () => {
    try {
      const response = await axios.post(`${USER_API_END_POINT}/reset-password`, {
        email,
        otp,
        newPassword,
      });

      if (response.data.success) {
        alert("Password Reset Successfully! Please login.");
        navigate("/login");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Error resetting password");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        {step === 1 ? (
          <>
            <h2 className="text-2xl font-bold text-gray-800 text-center">Forgot Password</h2>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-2 border rounded mt-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="w-full bg-blue-500 text-white p-2 rounded mt-3" onClick={sendOtp}>
              Send OTP
            </button>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-800 text-center">Reset Password</h2>
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full p-2 border rounded mt-3"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <input
              type="password"
              placeholder="New Password"
              className="w-full p-2 border rounded mt-3"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button className="w-full bg-green-500 text-white p-2 rounded mt-3" onClick={verifyOtpAndResetPassword}>
              Reset Password
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
