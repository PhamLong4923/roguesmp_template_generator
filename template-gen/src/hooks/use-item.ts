import {
    useQuery,
    useMutation,
    useQueryClient,
    queryOptions,
} from '@tanstack/react-query';
import {itemService} from "@/service/item";
import {Item} from "@/data/Item";

export const itemKeys = {
    all:        ()          => ['items']              as const,
    detail:     (id: string) => ['items', id]         as const,
    byBase:     (base: string) => ['items', 'base', base] as const,
};

export const itemQueryOptions = {
    all: () => queryOptions({
        queryKey: itemKeys.all(),
        queryFn:  itemService.getAll,
        staleTime: 5 * 60 * 1000,   // 5 phút cache
    }),

    detail: (id: string) => queryOptions({
        queryKey: itemKeys.detail(id),
        queryFn:  () => itemService.getById(id),
        staleTime: 5 * 60 * 1000,
        enabled:  !!id,
    }),

    byBase: (base: string) => queryOptions({
        queryKey: itemKeys.byBase(base),
        queryFn:  () => itemService.getByBase(base),
        staleTime: 5 * 60 * 1000,
        enabled:  !!base,
    }),
};

export function useItems() {
    return useQuery(itemQueryOptions.all());
}

export function useItem(id: string) {
    return useQuery(itemQueryOptions.detail(id));
}

export function useItemsByBase(base: string) {
    return useQuery(itemQueryOptions.byBase(base));
}

export function useCreateItem() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: Item) => itemService.create(data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: itemKeys.all() });
        },
    });
}

export function useUpdateItem() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Item }) =>
            itemService.update(id, data),

        // Optimistic update
        onMutate: async ({ id, data }) => {
            await qc.cancelQueries({ queryKey: itemKeys.detail(id) });
            const previous = qc.getQueryData(itemKeys.detail(id));
            qc.setQueryData(itemKeys.detail(id), (old: any) => ({ ...old, ...data }));
            return { previous };
        },
        onError: (_, { id }, ctx) => {
            qc.setQueryData(itemKeys.detail(id), ctx?.previous);
        },
        onSettled: (_, __, { id }) => {
            qc.invalidateQueries({ queryKey: itemKeys.detail(id) });
            qc.invalidateQueries({ queryKey: itemKeys.all() });
        },
    });
}

export function useDeleteItem() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => itemService.remove(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: itemKeys.all() });
        },
    });
}