import {queryOptions, useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {itemKeys} from "@/hooks/use-item";
import {loottableService} from "@/service/loottable";
import {LootTable} from "@/type/loottable";

export const lootKeys = {
    all: () => ['loots'] as const,
    detail: (id: string) => ['loots', id] as const,
    byPath: (path: string) => ['loots', 'path', path] as const,
}

export const lootQueryOptions = {
    all: () => queryOptions({
        queryKey: itemKeys.all(),
        queryFn: loottableService.getAll,
        staleTime: 5 * 60 * 1000,
    }),

    detail: (id: string) => queryOptions({
        queryKey: lootKeys.detail(id),
        queryFn: () => loottableService.getById(id),
        staleTime: 5 * 60 * 1000,
        enabled: !!id,
    })
}

export function useLootTables() {
    return useQuery(lootQueryOptions.all());
}

export function useLootTableById(id: string) {
    return useQuery(lootQueryOptions.detail(id));
}

export function useCreateLoot() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: LootTable) => loottableService.create(data),
        onSuccess: () => {
            qc.invalidateQueries({queryKey: itemKeys.all()});
        },
    })
}

export function useUpdateLoot() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({id, data}: { id: string; data: LootTable }) => loottableService.update(id, data),

        onMutate: async ({id, data}) => {
            await qc.cancelQueries({queryKey: lootKeys.detail(id)});
            const previous = qc.getQueryData(lootKeys.detail(id));
            qc.setQueryData(lootKeys.detail(id), (old: any) => ({...old, ...data}));
            return {previous};
        },

        onError: (_, {id}, ctx) => {
            qc.setQueryData(lootKeys.detail(id), ctx?.previous);
        },
        onSettled: (_, __, {id}) => {
            qc.invalidateQueries({queryKey: lootKeys.detail(id)});
            qc.invalidateQueries({queryKey: lootKeys.all()});
        }
    })
}

export function useDeleteLoot() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => loottableService.remove(id),
        onSuccess: () => {
            qc.invalidateQueries({queryKey: lootKeys.all()});
        }
    })
}
