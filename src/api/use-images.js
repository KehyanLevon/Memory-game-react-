import { useQuery } from "@tanstack/react-query";

export function useImages(count) {
  return useQuery({
    queryKey: ["images", count],
    queryFn: async () => {
      const page = Math.floor(Math.random() * 10) + 1;
      const res = await fetch(
        `https://picsum.photos/v2/list?page=${page}&limit=${count}`
      );
      if (!res.ok) throw new Error("Failed to fetch images");
      return res.json();
    },
    staleTime: Infinity,
  });
}
