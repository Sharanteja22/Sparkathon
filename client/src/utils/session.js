// src/utils/session.js
export const getSessionId = () => {
  let sessionId = localStorage.getItem("sessionId");
  if (!sessionId) {
    sessionId = crypto.randomUUID(); // or use any UUID library
    localStorage.setItem("sessionId", sessionId);
  }
  return sessionId;
};
