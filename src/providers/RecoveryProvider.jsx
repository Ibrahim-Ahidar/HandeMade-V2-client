/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";

const RecoveryContext = createContext();

export const useRecovery = () => useContext(RecoveryContext);

export const RecoveryProvider = ({ children }) => {
  const [email, setEmailState] = useState(null);
  const [resetToken, setResetTokenState] = useState(null);
  const [loading, setLoading] = useState(true);

  const setEmail = (value) => {
    setEmailState(value);

    if (value) {
      sessionStorage.setItem("email", value);
    } else {
      sessionStorage.removeItem("email");
    }
  };

  const setResetToken = (value) => {
    setResetTokenState(value);

    if (value) {
      sessionStorage.setItem("resetToken", value);
    } else {
      sessionStorage.removeItem("resetToken");
    }
  };

  const clearRecovery = () => {
    setEmailState(null);
    setResetTokenState(null);
    sessionStorage.removeItem("email");
    sessionStorage.removeItem("resetToken");
    sessionStorage.removeItem("recoveryFlow");
  };

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("email");
    const storedToken = sessionStorage.getItem("resetToken");

    if (storedEmail) setEmailState(storedEmail);
    if (storedToken) setResetTokenState(storedToken);

    setLoading(false);
  }, []);

  return (
    <RecoveryContext.Provider
      value={{
        email,
        setEmail,
        resetToken,
        setResetToken,
        clearRecovery,
        loading,
        setLoading,
      }}
    >
      {children}
    </RecoveryContext.Provider>
  );
};
