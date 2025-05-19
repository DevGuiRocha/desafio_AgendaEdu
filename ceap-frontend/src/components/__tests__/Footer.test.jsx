// src/components/__tests__/Footer.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../Footer';

describe('Footer', () => {
    beforeEach(() => {
        render(<Footer />);
    });

    it('tem o footer com a classe correta', () => {
        // <footer> tem role="contentinfo"
        const footer = screen.getByRole('contentinfo');
        expect(footer).toBeInTheDocument();
        expect(footer).toHaveClass('footer');
    });

    it('exibe o texto de copyright com o ano atual', () => {
        const year = new Date().getFullYear();
        // usamos RegExp para escapar o ponto final
        const regex = new RegExp(`© ${year} Sistema de colsuta de Despesas Políticas\\. Todos os direitos reservados`);
        expect(screen.getByText(regex)).toBeInTheDocument();
    });

    it('contém o link para o LinkedIn do desenvolvedor com atributos corretos', () => {
        const link = screen.getByRole('link', { name: /Guilherme Rocha/i });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', 'https://www.linkedin.com/in/guilherme-rocha-828701b6/');
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
        expect(link).toHaveClass('link');
    });
});
