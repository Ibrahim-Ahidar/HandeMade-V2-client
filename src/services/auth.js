import API from "../api/axios";

export const forgotPassword = (email) =>
  API.post("/auth/forgot-password", { email });

export const verifyCode = (email, code) => 
  API.post("/auth/verify-code", { email, code });

export const resetPassword = (resetToken, newPassword) =>
  API.post("/auth/reset-password", { resetToken, newPassword });

export const verifySignupCode = (email, code) =>
  API.post("/auth/verify-signup-code", { email, code });

export const logout = () => API.post("/logout");

// signup
export const signup = async (userData) => {
  try {
    const res = await API.post("/signup", userData);
    return res.data;
  } catch (err) {
    throw err.response?.data || err.message;
  }
};
// google signup
export const GoogleSignup = async (res) => {
  try {
    const googleToken = res.credential;
    if (!googleToken) throw new Error("Missing Google credential");

    const { data } = await API.post("/googleSignup", { token: googleToken });
    return data;
  } catch (err) {
    throw err.response?.data || err.message;
  }
};
// login
export const login = async (userData) => {
  try {
    const res = await API.post("/login", userData);
    return res.data;
  } catch (err) {
    throw err.response?.data || err.message;
  }
};

// google login
export const GoogleLogin = async (res) => {
  try {
    const googleToken = res.credential;
    if (!googleToken) throw new Error("Missing Google credential");

    const { data } = await API.post("/googleLogin", { token: googleToken });
    return data;
  } catch (err) {
    throw err.response?.data || err.message;
  }
};