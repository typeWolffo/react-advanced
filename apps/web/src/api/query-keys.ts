import { ApiClient } from './api-client';
import { createQueryKeyStore } from "@lukemorales/query-key-factory";

export const queries = createQueryKeyStore({
  user: {
    byId: (id: string) => ({
        queryKey: ["user", id],
        queryFn: async () => {
            const response = await ApiClient.api.userControllerGetUserById(id);
            return response.data.data;
        },
    }),
  },
  auth: {
    currentUser: {
        queryKey: ["currentUser"],
        queryFn: async () => {
            const response = await ApiClient.api.authControllerCurrentUser();
            return response.data.data;
        },
    },
  },
});
