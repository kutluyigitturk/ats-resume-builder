"use client";

import { createContext, useContext } from "react";

// The builder's layout already knows who is signed in. Handing the address
// down means the re-authentication dialog does not have to ask for it - and
// cannot ask /api/auth/me for it either, because by the time that dialog
// exists the session is dead and the call would 401.
const AccountEmailContext = createContext(null);

export function AccountEmailProvider({ email, children }) {
  return <AccountEmailContext.Provider value={email}>{children}</AccountEmailContext.Provider>;
}

export function useAccountEmail() {
  return useContext(AccountEmailContext);
}
