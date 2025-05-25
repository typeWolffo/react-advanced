import { useMutation } from "@tanstack/react-query";
import { UseFormSetError } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ApiClient } from "../api-client";
import { RegisterBody } from "../generated-api";

type RegisterUserMutationOptions = {
    data: RegisterBody;
    setError?: UseFormSetError<RegisterBody>;
}

export const useRegisterUser = () => {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: async ({ data }: RegisterUserMutationOptions) => {
          const response = await ApiClient.api.authControllerRegister(data);

          return { data: response.data.data };
        },
        onSuccess: () => {
            navigate("/auth/login");
        },
    })
};
