/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";

const RecoveryContext = createContext();

export const useRecovery = () => useContext(RecoveryContext);

function readStored(key) {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

export const RecoveryProvider = ({ children }) => {
  const [email, setEmailState] = useState(() => readStored("email"));
  const [resetToken, setResetTokenState] = useState(() => readStored("resetToken"));
  const [loading, setLoading] = useState(false);

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
