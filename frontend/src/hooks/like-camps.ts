import { getLikedCamps, likeCamp } from "@app/services/camps";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useLikeCamp() {
    const queryClient = useQueryClient();
    const { data, isLoading } = useQuery({
        queryKey: ["likedCamps"],
        queryFn: getLikedCamps,
        staleTime: 1000 * 60 * 30, // 30 minutes
    });

    const like = useMutation({
        async mutationFn(campId: number) {
            return await likeCamp(campId);
        },
        onMutate(campId: number) {
            // Optimistically update the cache
            queryClient.setQueryData(["likedCamps"], (oldData: any) => {
                return {
                    camps: oldData.camps.map((camp: any) => {
                        if (camp.id === campId) {
                            return { ...camp, isLiked: !camp.isLiked };
                        }
                        return camp;
                    }),
                };
            });
        },
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: ["likedCamps"] });
        },
    });

    return {
        getCamps: {
            camps: data?.camps ?? [],
            isLoading,
        },
        likeCamp: {
            like: like.mutateAsync,
            isLoading: like.isPending,
        },
    };
}
