"use client";

import React, { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { store } from "@/src/store/store";
import { setAuth, setUser } from "@/src/store/authSlice";
import Api from "@/src/Utils/Api";

const HydrateAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const hydrate = async () => {
      try {
        const token = localStorage.getItem("userToken");
        const agentToken = localStorage.getItem("agentToken");
        const userId = localStorage.getItem("userId");
        const agentId = localStorage.getItem("agentId");
        const isAgentApproved = localStorage.getItem("isAgentApproved") === "true";
        const userJson = localStorage.getItem("user");
        let user = userJson ? JSON.parse(userJson) : null;

        if (token || agentToken || userId || agentId) {
          // Dispatch immediately with what we have
          dispatch(
            setAuth({
              userToken: token,
              agentToken: agentToken,
              userId: userId,
              agentId: agentId,
              isAgent: Boolean(agentId),
              isAgentApproved,
              user,
            }),
          );

          // Fetch fresh agent approval status in the background if they are an agent
          if (agentId) {
            try {
              const res = await Api.get(`/agent/status/${agentId}`);
              if (res.data) {
                const freshApproved = res.data.registrationStatus === "approved" || res.data.isApproved === true;
                localStorage.setItem("isAgentApproved", freshApproved ? "true" : "false");
                dispatch(setAuth({ isAgentApproved: freshApproved }));
              }
            } catch (err) {
              console.error("Failed to fetch fresh agent status", err);
            }
          }

          // If user object is missing, fetch it in the background
          if (userId && !user) {
            try {
              const res = await Api.get(`/user/${userId}`);
              const fetchedUser = res.data;
              localStorage.setItem("user", JSON.stringify(fetchedUser));
              dispatch(setUser(fetchedUser));
            } catch (err) {
              console.error("Failed to hydrate user", err);
            }
          }
        }
      } catch (_) { }
    };

    hydrate();
  }, [dispatch]);

  return <>{children}</>;
};

export default function ProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <HydrateAuth>{children}</HydrateAuth>
    </Provider>
  );
}
