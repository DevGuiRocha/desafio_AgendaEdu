import { useMemo } from 'react';

export function filterPartidos(deputados) {
    return useMemo(() => {
        const setP = new Set(deputados.map(d => d.sg_partido));
        return ["Todos", ...Array.from(setP).sort()];
    }, [deputados]);
}