import React from 'react';
import { useLayoutEffect, useEffect, useState } from 'react';
import { getDeputados } from '../services/deputado';
import styles from './Home.module.css';
import currency from '../utils/currency';
import { useSummary } from '../hooks/useSummary';

export default function Home() {
    useLayoutEffect(() => window.scrollTo(0, 0));

    const [deputados, setDeputados] = useState([]);

    useEffect(() => {
        getDeputados('CE')
            .then(data => setDeputados(data))
            .catch(console.error);
    }, []);

    const { totalDeputados, totalDespesas, totalGastos } = useSummary(deputados);

    return (
        <div className={styles.container}>
            <div className={styles.intro}>
                <h1>Bem-vindo ao Sistema de Consulta de Deputados</h1>
                <p>
                    Este sistema permite consultar informações sobre deputados federais e suas despesas parlamentares.<br/>
                    Use a barra de navegação acima ou os botões abaixo para começar.
                </p>
            </div>

            <div className={styles.actions}>
                <button
                    className={styles.primaryButton}
                    onClick={() => window.location.href = '/deputados'}
                >
                    Consultar Deputados
                </button>
                <button
                    className={styles.secondaryButton}
                    onClick={() => window.location.href = '/uploadcsv'}
                >
                    Importar CSV
                </button>
            </div>

            <h2 className={styles.summaryTitle}>Resumo Geral das Informações</h2>

            <div className={styles.cards}>
                <div className={styles.card}>
                    <h3>Total de Deputados</h3>
                    <p className={styles.cardValue}>{totalDeputados}</p>
                </div>
                <div className={styles.card}>
                    <h3>Quantidade de Despesas</h3>
                    <p className={styles.cardValue}>{totalDespesas}</p>
                </div>
                <div className={styles.card}>
                    <h3>Gastos Totais</h3>
                    <p className={styles.cardValue}>{currency.format(totalGastos)}</p>
                </div>
            </div>
        </div>
    )
}
