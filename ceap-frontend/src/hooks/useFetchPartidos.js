import { useMemo } from 'react';

export function useFetchPartidos(deputados) {
    return useMemo(() => {
        const setP = new Set(deputados.map(d => d.sg_partido));
        return ["Todos", ...Array.from(setP).sort()];
    }, [deputados]);
}