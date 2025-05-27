// src/components/__tests__/NavBar.test.jsx
import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NavBar from '../NavBar';
import styles from '../NavBar.module.css';

describe('NavBar', () => {
    beforeEach(() => {
        render(
        <MemoryRouter>
            <NavBar />
        </MemoryRouter>
        );
});

    it('renderiza a marca com logo e título', () => {
        const img = screen.getByAltText('Logo');
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute('src', expect.stringContaining('logo.png'));

        const title = screen.getByText(/Despesas Públicas/i);
        expect(title).toBeInTheDocument();
    });

    it('renderiza os três links de navegação com os caminhos corretos', () => {
        const homeLink = screen.getByRole('link', { name: /Home/i });
        const depLink  = screen.getByRole('link', { name: /Consultar Deputados/i });
        const impLink  = screen.getByRole('link', { name: /Importar CSV/i });

        expect(homeLink).toHaveAttribute('href', '/');
        expect(depLink).toHaveAttribute('href', '/deputados');
        expect(impLink).toHaveAttribute('href', '/uploadcsv');
    });

    it('aplica a classe de link corretamente para hover etc.', () => {
        const linksContainer = screen.getByRole('navigation').querySelector(`.${styles.links}`);
        const links = within(linksContainer).getAllByRole('link');
        links.forEach(link => {
            expect(link).toHaveClass('link');
        });
    });
});
