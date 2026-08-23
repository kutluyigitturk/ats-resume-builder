"use client";

import { createContext, useContext } from "react";

// The dashboard layout already resolved the session on the server. Handing the
// user down means the menu renders with a name and initials in its first
// frame - fetching /api/auth/me from the client would draw an empty circle
// first and fill it in a moment later, on every navigation.
const SessionUserContext = createContext(null);

export function SessionUserProvider({ user, children }) {
  return <SessionUserContext.Provider value={user}>{children}</SessionUserContext.Provider>;
}

export function useSessionUser() {
  return useContext(SessionUserContext);
}
