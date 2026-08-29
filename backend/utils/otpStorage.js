const otpStorage = {};

// Function to store OTP
export const storeOtp = (email, otp) => {
    const otpExpiry = Date.now() + 5 * 60 * 1000; // OTP valid for 5 minutes
    otpStorage[email] = { otp, otpExpiry };
};

// Function to retrieve OTP data
export const getOtpData = (email) => {
    return otpStorage[email];
};

// Function to delete OTP after use or expiry
export const deleteOtp = (email) => {
    delete otpStorage[email];
};
export default otpStorage;