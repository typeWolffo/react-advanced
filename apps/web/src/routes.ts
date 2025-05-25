import { type RouteConfig, route, layout } from "@react-router/dev/routes";

export default [
  route("/", "routes/_index.tsx"),
  route("/login", "routes/login.tsx"),
  route("/register", "routes/register.tsx"),

  // Protected routes - automatically wrapped with auth
  layout("layouts/ProtectedLayout.tsx", [
    route("/dashboard", "routes/dashboard.tsx"),
    route("/profile", "routes/profile.tsx"),
    route("/chat", "routes/chat.tsx"),
    // Add more protected routes here without thinking about auth
    // route("/settings", "routes/settings.tsx"),
  ]),
] satisfies RouteConfig;
