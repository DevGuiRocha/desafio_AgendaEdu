// src/pages/__tests__/Home.test.jsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Home from '../Home';
import api from '../../services/api';

// Faz o Jest usar o mock do módulo api
jest.mock('../../services/api');

describe('Home', () => {
    const fakeDeputados = [
        { id: 1, total_gastos: 100.5, qtde_despesa: 2 },
        { id: 2, total_gastos: 200.25, qtde_despesa: 3 },
    ];

    beforeEach(() => {
        // limpa mocks entre testes
        jest.resetAllMocks();
        // mocka a resposta do api.get('/deputados')
        api.get.mockResolvedValue({ data: fakeDeputados });
    });

    it('faz scroll para o topo ao montar', () => {
        const spy = jest.spyOn(window, 'scrollTo').mockImplementation(() => {});
        render(<Home />);
        expect(spy).toHaveBeenCalledWith(0, 0);
        spy.mockRestore();
    });

    it('renderiza título, descrição e botões de ação', async () => {
        render(<Home />);

        expect(
        screen.getByRole('heading', { level: 1, name: /Bem-vindo ao Sistema de Consulta de Deputados/i })
        ).toBeInTheDocument();

        expect(
        screen.getByText(/Este sistema permite consultar informações/i)
        ).toBeInTheDocument();

        expect(screen.getByRole('button', { name: /Consultar Deputados/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Importar CSV/i })).toBeInTheDocument();
    });

    it('exibe os cards de resumo corretamente após o fetch', async () => {
        render(<Home />);

        // espera o efeito do useEffect terminar
        await waitFor(() => expect(api.get).toHaveBeenCalledWith('/deputados', {"params": {"uf": "CE"}}));

        // total de deputados
        expect(screen.getByText('Total de Deputados')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();

        // quantidade de despesas (2 + 3 = 5)
        expect(screen.getByText('Quantidade de Despesas')).toBeInTheDocument();
        expect(screen.getByText('5')).toBeInTheDocument();

        // gastos totais (100.5 + 200.25 = 300.75 → R$ 300,75)
        expect(screen.getByText('Gastos Totais')).toBeInTheDocument();
        expect(screen.getByText('R$ 300,75')).toBeInTheDocument();
    });

    it('mostra zeros quando não há deputados', async () => {
        // simula resposta vazia
        api.get.mockResolvedValueOnce({ data: [] });
        render(<Home />);

        await waitFor(() => expect(api.get).toHaveBeenCalled());

        const zeros = screen.getAllByText('0');

        expect(zeros[0]).toBeInTheDocument();
        expect(zeros[1]).toBeInTheDocument();

        expect(screen.getByText('Total de Deputados')).toBeInTheDocument();
        expect(screen.getByText('Quantidade de Despesas')).toBeInTheDocument();

        expect(screen.getByText('Gastos Totais')).toBeInTheDocument();
        expect(screen.getByText('R$ 0,00')).toBeInTheDocument();
    });
});
