import { useMutation } from "@tanstack/react-query";
import { LoginBody, LoginResponse } from "../generated-api";
import { ApiClient } from "../api-client";
import { UseFormSetError } from "react-hook-form";
import { AxiosError } from "axios";
import { queryClient } from "../queryClient";
import { queries } from "../query-keys";

type LoginUserMutationOptions = {
    data: LoginBody;
    setError?: UseFormSetError<LoginBody>;
}

export const useLoginUser = () => {
return useMutation<
LoginResponse['data'],
AxiosError | Error,
LoginUserMutationOptions
>({
    mutationFn: async (options: LoginUserMutationOptions) => {
        const response = await ApiClient.api.authControllerLogin(options.data);
        return response.data.data;
    },
    onSuccess: (data) => {
        // Store token for chat app
        if (data.accessToken) {
            localStorage.setItem('authToken', data.accessToken);
        }
        queryClient.invalidateQueries(queries.auth.currentUser);
    },
})
};
