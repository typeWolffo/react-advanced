import { useQuery } from "@tanstack/react-query";
import { queries } from "../query-keys";

export const useCurrentUser = () => useQuery(queries.auth.currentUser)

export const useUser = (userId: string) => useQuery(queries.user.byId(userId))
