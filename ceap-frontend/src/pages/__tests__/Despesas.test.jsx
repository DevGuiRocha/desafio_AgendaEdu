// src/pages/__tests__/Despesas.test.jsx
import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Despesa from '../Despesas';
import api from '../../services/api';

jest.mock('../../services/api');

describe('Página Despesas', () => {
    const fakeDespesas = [
        {
        id: 1,
        ide_cadastro: 123,
        nome_parlamentar: 'Deputado Exemplo',
        dat_emissao: '2024-01-15',
        txt_fornecedor: 'Fornecedor A',
        vlr_liquido: 100.5,
        url_documento: 'http://nota1',
        },
        {
        id: 2,
        ide_cadastro: 123,
        nome_parlamentar: 'Deputado Exemplo',
        dat_emissao: '2024-02-20',
        txt_fornecedor: 'Fornecedor B',
        vlr_liquido: 50.25,
        url_documento: '',
        },
    ];

    beforeAll(() => {
        // previne erro de scrollTo
        window.scrollTo = jest.fn();
    });

    function renderWithRouter(id = '123') {
        render(
        <MemoryRouter initialEntries={[`/deputados/${id}/despesas`]}>
            <Routes>
            <Route path="/deputados/:id/despesas" element={<Despesa />} />
            </Routes>
        </MemoryRouter>
        );
    }

    it('chama API, exibe card do deputado com dados corretos', async () => {
        api.get.mockResolvedValueOnce({ data: fakeDespesas });

        renderWithRouter();

        // aguarda chamada
        await waitFor(() => {
        expect(api.get).toHaveBeenCalledWith('/deputados/123/despesas');
        });

        // encontra o <img alt="Foto de Deputado Exemplo">
        const img = await screen.findByAltText(/Foto de Deputado Exemplo/i);
        const card = img.closest('div');

        // nome
        expect(within(card).getByText('Deputado Exemplo')).toBeInTheDocument();

        // fornecedor
        expect(within(card).getByText('Fornecedor:')).toBeInTheDocument();
        expect(within(card).getByText('Fornecedor A')).toBeInTheDocument();

        // quantidade total de despesas
        expect(within(card).getByText(String(fakeDespesas.length))).toBeInTheDocument();
    });

    it('renderiza as linhas da tabela corretamente e botões/ver nota', async () => {
        api.get.mockResolvedValueOnce({ data: fakeDespesas });
        renderWithRouter();

        // aguarda a tabela aparecer
        await screen.findByRole('table');

        // aguarda as 2 linhas de dados
        await waitFor(() => {
        const rows = screen.getAllByRole('row');
        expect(rows.length - 1).toBe(fakeDespesas.length);
        });

        // verifica conteúdo da primeira linha
        const rows = screen.getAllByRole('row');
        const firstRow = rows[1];

        // data formatada dinamicamente
        const date0 = new Date(fakeDespesas[0].dat_emissao).toLocaleDateString();
        expect(within(firstRow).getByText(date0)).toBeInTheDocument();

        expect(within(firstRow).getByText('Fornecedor A')).toBeInTheDocument();

        // link “Ver Nota”
        const link = within(firstRow).getByRole('link', { name: /Ver Nota/i });
        expect(link).toHaveAttribute('href', fakeDespesas[0].url_documento);

        // segunda linha: sem nota fiscal
        const secondRow = rows[2];
        expect(within(secondRow).getByText(
        new Date(fakeDespesas[1].dat_emissao).toLocaleDateString()
        )).toBeInTheDocument();
        const btn = within(secondRow).getByRole('button', { name: /Sem Nota Fiscal/i });
        expect(btn).toBeDisabled();
    });

    it('ajusta corretamente as linhas por página', async () => {
        // 12 itens para testar paginação
        const many = Array.from({ length: 12 }, (_, i) => ({
        id: i+1,
        ide_cadastro: 123,
        nome_parlamentar: 'Deputado',
        dat_emissao: '2024-03-01',
        txt_fornecedor: `F${i+1}`,
        vlr_liquido: i+1,
        url_documento: 'http://x',
        }));
        api.get.mockResolvedValueOnce({ data: many });
        renderWithRouter();

        await screen.findByRole('table');

        // padrão (10)
        await waitFor(() => {
        const rows = screen.getAllByRole('row');
        expect(rows.length - 1).toBe(10);
        });

        // muda para 5
        const select = screen.getByLabelText(/Linhas Por página/i);
        await userEvent.selectOptions(select, '50');

        await waitFor(() => {
            const rows = screen.getAllByRole('row');
            expect(rows.length - 1).toBe(12);
        });
    });

    it('exibe os botões Home e Voltar', async () => {
        api.get.mockResolvedValueOnce({ data: fakeDespesas });
        renderWithRouter();
        await screen.findByRole('table');

        expect(screen.getByRole('button', { name: /Home/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Voltar/i })).toBeInTheDocument();
    });
});
