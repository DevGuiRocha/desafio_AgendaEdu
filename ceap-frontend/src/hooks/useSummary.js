import { useMemo } from 'react';

export function useSummary(deputados) {
    return useMemo(() => {
        const totalDeputados = deputados.length;
        const totalDespesas  = deputados.reduce((sum, d) => sum + (d.qtde_despesa || 0), 0);
        const totalGastos    = deputados.reduce((sum, d) => sum + (d.total_gastos || 0), 0);
        return { totalDeputados, totalDespesas, totalGastos };
    }, [deputados]);
}