import { useLayoutEffect } from 'react';

export default function Home() {
    useLayoutEffect(() => window.scrollTo(0, 0));

    return (
        <div>
            <h1>Bem-vindo ao meu desafio de programação ^^</h1>
            <p>Por gentileza, use a navbar para realizar a navegação entre as seções</p>
        </div>
    );
}
