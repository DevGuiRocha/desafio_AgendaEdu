// src/pages/__tests__/UploadCsv.test.jsx
import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UploadCsv from '../UploadCsv';
import api from '../../services/api';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
    }));
    jest.mock('../../services/api');

    describe('UploadCsv', () => {
    beforeAll(() => {
        window.scrollTo = jest.fn();
    });

    beforeEach(() => {
        jest.resetAllMocks();
        // garante timers reais por padrão
        jest.useRealTimers();
    });

    it('renderiza form e botões corretamente ao iniciar', () => {
        render(<UploadCsv />);
        const fileInput = screen.getByLabelText(/Selecione um arquivo CSV/i);
        const importBtn = screen.getByRole('button', { name: /Importar CSV/i });
        const homeBtn   = screen.getByRole('button', { name: /Home/i });

        expect(fileInput).toBeInTheDocument();
        expect(importBtn).toBeDisabled();
        expect(homeBtn).toBeEnabled();
    });

    it('ativa o botão Importar ao selecionar um arquivo', async () => {
        render(<UploadCsv />);
        const fileInput = screen.getByLabelText(/Selecione um arquivo CSV/i);
        const importBtn = screen.getByRole('button', { name: /Importar CSV/i });

        const file = new File(['a,b,c'], 'test.csv', { type: 'text/csv' });
        await userEvent.upload(fileInput, file);

        expect(importBtn).toBeEnabled();
    });

    it('tratamento de erro na importação', async () => {
        api.post.mockRejectedValueOnce(new Error('falha'));
        render(<UploadCsv />);

        const fileInput = screen.getByLabelText(/Selecione um arquivo CSV/i);
        const importBtn = screen.getByRole('button', { name: /Importar CSV/i });
        const homeBtn   = screen.getByRole('button', { name: /Home/i });

        const file = new File(['x'], 'err.csv', { type: 'text/csv' });
        await userEvent.upload(fileInput, file);
        await userEvent.click(importBtn);

        // espera mensagem de erro
        await waitFor(() => {
        expect(screen.getByText(/Erro no upload do arquivo/i)).toBeInTheDocument();
        });

        // volta ao estado idle
        expect(importBtn).toBeDisabled(); // sem arquivo, fica desabilitado
        expect(homeBtn).toBeEnabled();
        expect(fileInput.value).toBe('');
    });

    it('botão Home navega imediatamente', async () => {
        render(<UploadCsv />);
        const homeBtn = screen.getByRole('button', { name: /Home/i });
        await userEvent.click(homeBtn);
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });
});
