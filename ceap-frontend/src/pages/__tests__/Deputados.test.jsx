// src/pages/__tests__/Deputados.test.jsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Deputados from '../Deputados';
import api from '../../services/api';

jest.mock('../../services/api');

describe('Página Deputados', () => {
    // dados de exemplo para filtragem
    const smallData = [
        {
        id: 1,
        ide_cadastro: 11,
        nome_parlamentar: 'Alice Silva',
        sg_partido: 'AAA',
        maior_despesa: 100.5,
        total_gastos: 500.5,
        },
        {
        id: 2,
        ide_cadastro: 22,
        nome_parlamentar: 'Bob Santos',
        sg_partido: 'BBB',
        maior_despesa: 200.75,
        total_gastos: 600.75,
        },
        {
        id: 3,
        ide_cadastro: 33,
        nome_parlamentar: 'Carol Lima',
        sg_partido: 'AAA',
        maior_despesa: 150.25,
        total_gastos: 450.25,
        }
    ];

    beforeAll(() => {
        // evita erro de scrollTo em useLayoutEffect
        window.scrollTo = jest.fn();
    });

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('busca da API e exibe a lista completa', async () => {
        api.get.mockResolvedValueOnce({ data: smallData });

        render(
        <MemoryRouter>
            <Deputados />
        </MemoryRouter>
        );

        await waitFor(() => expect(api.get).toHaveBeenCalledWith('/deputados', {"params": {"uf": "CE"}}));

        await waitFor(() => {
            const allRows = screen.getAllByRole('row');
            expect(allRows.length - 1).toBe(smallData.length);
        });

        // Verifica alguns valores formatados
        expect(screen.getByText('Alice Silva')).toBeInTheDocument();
        expect(screen.getByText('Bob Santos')).toBeInTheDocument();
        expect(screen.getByText('Carol Lima')).toBeInTheDocument();

        // Moeda brasileira
        expect(screen.getByText('R$ 100,50')).toBeInTheDocument();
        expect(screen.getByText('R$ 600,75')).toBeInTheDocument();
    });

    it('filtra pelo nome e pelo partido, e limpa filtros', async () => {
        api.get.mockResolvedValueOnce({ data: smallData });

        render(
        <MemoryRouter>
            <Deputados />
        </MemoryRouter>
        );

        await waitFor(() => expect(api.get).toHaveBeenCalled());

        // inicialmente todos aparecem
        await waitFor(() => {
            const rows = screen.getAllByRole('row');
            expect(rows.length - 1).toBe(3);
        });

        // filtra por nome "ali" (case-insensitive)
        const nameInput = screen.getByPlaceholderText(/busca por nome/i);
        await userEvent.type(nameInput, 'ali');

        const rowsAfterFilter = await screen.findAllByRole('row');
        expect(rowsAfterFilter.length - 1).toBe(1);
        expect(screen.getByText('Alice Silva')).toBeInTheDocument();

        // 2) Limpa apenas o filtro de nome
        const clearBtn = screen.getByRole('button', { name: /limpar filtros/i });
        await userEvent.click(clearBtn);
        // volta aos 3 deputados
        await waitFor(() => {
            const rows = screen.getAllByRole('row');
            expect(rows.length - 1).toBe(3);
        });

        // agora filtra por partido AAA
        const partySelect = screen.getByRole('combobox');
        await userEvent.selectOptions(partySelect, 'AAA');

        // Alice continua (já era AAA), Carol também → 2 resultados
        const rowsAfterParty = await screen.findAllByRole('row');
        expect(rowsAfterParty.length - 1).toBe(2);
        expect(screen.getByText('Alice Silva')).toBeInTheDocument();
        expect(screen.getByText('Carol Lima')).toBeInTheDocument();

        // limpa filtros
        expect(clearBtn).toBeEnabled();
        await userEvent.click(clearBtn);

        // volta ao estado inicial
        expect(nameInput).toHaveValue('');
        expect(partySelect).toHaveValue('Todos');
        expect(screen.getAllByRole('row').length - 1).toBe(3);
    });

    it('faz paginação quando há mais de 10 deputados', async () => {
        // gera 12 deputados de exemplo
        const bigData = Array.from({ length: 12 }, (_, i) => ({
        id: i + 1,
        ide_cadastro: 100 + i,
        nome_parlamentar: `Deputado ${i + 1}`,
        sg_partido: i % 2 === 0 ? 'AAA' : 'BBB',
        maior_despesa: 10 + i,
        total_gastos: 100 + i,
        }));
        api.get.mockResolvedValueOnce({ data: bigData });

        render(
        <MemoryRouter>
            <Deputados />
        </MemoryRouter>
        );

        await waitFor(() => expect(api.get).toHaveBeenCalled());

        // página 1 deve mostrar 10 registros
        await waitFor(() => {
            const rowsPage1 = screen.getAllByRole('row');
            expect(rowsPage1.length - 1).toBe(10);
        });
        expect(screen.queryByText('Deputado 11')).not.toBeInTheDocument();

        // avança para a próxima página
        const nextBtn = screen.getByRole('button', { name: /próxima/i });
        await userEvent.click(nextBtn);

        // agora só aparecem 2 registros (11 e 12)
        const rowsPage2 = await screen.findAllByRole('row');
        expect(rowsPage2.length - 1).toBe(2);
        expect(screen.getByText('Deputado 11')).toBeInTheDocument();
        expect(screen.getByText('Deputado 12')).toBeInTheDocument();
    });
});
