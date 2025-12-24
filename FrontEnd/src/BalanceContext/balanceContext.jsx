import { useQuery } from "@tanstack/react-query";
import { userBalance } from "../Api/balance";
export function useBalance() {
  return useQuery({
    queryKey: ["currentBalance"],
    queryFn: async () => {
      const res = await userBalance();
      return res;
    },
    retry: false,
  });
}
