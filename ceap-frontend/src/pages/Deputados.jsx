import React from 'react';
import { useEffect, useState, useLayoutEffect, useMemo } from "react";
import api from '../services/api';
import { Link } from 'react-router-dom';
import styles from './Deputados.module.css';
import currency from '../utils/currency';

export default function Deputados() {
    useLayoutEffect(() => window.scrollTo(0, 0));

    const [deputados, setDeputados] = useState([]);
    const [filtroNome, setFiltroNome] = useState("");
    const [filtroPartido, setFiltroPartido] = useState("Todos");
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    useEffect(() => {
        api.get('/deputados')
            .then(res => setDeputados(res.data))
            .catch(console.error);
    }, []);

    const partidos = useMemo(() => {
        const setP = new Set(deputados.map(d => d.sg_partido));
        return ["Todos", ...Array.from(setP).sort()];
    }, [deputados]);

    const deputadosFiltrados = useMemo(() => {
        return deputados.filter(d => {
            const matchNomes = d.nome_parlamentar
                                .toLowerCase()
                                .includes(filtroNome.toLocaleLowerCase());
            const matchPartidos = filtroPartido === "Todos"
                ? true
                : d.sg_partido === filtroPartido;
            return matchNomes && matchPartidos
        });
    }, [deputados, filtroNome, filtroPartido]);

    const totalPages = Math.max(1, Math.ceil(deputadosFiltrados.length / pageSize));
    const start = (currentPage - 1) * pageSize;
    const paged = deputadosFiltrados.slice(start, start + pageSize);

    useEffect(() => {
        setCurrentPage(1);
    }, [filtroNome, filtroPartido]);

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Lista de Deputados (CE)</h2>

            <div className={styles.filters}>
                <input
                    type="text"
                    placeholder="Busca por nome..."
                    value={filtroNome}
                    onChange={e => setFiltroNome(e.target.value)}
                    className={styles.filterInput}
                />

                <select
                    value={filtroPartido}
                    onChange={e => setFiltroPartido(e.target.value)}
                    className={styles.filterSelect}
                >
                    {partidos.map(p => (
                        <option key={p} value={p}>{p}</option>
                    ))}
                </select>

                <button
                    type="button"
                    className={styles.filterClear}
                    onClick={() => {
                        setFiltroNome("");
                        setFiltroPartido("Todos");
                    }}
                    disabled={!filtroNome && filtroPartido === "Todos"}
                >
                    Limpar Filtros
                </button>
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Foto</th>
                            <th>Nome Deputado</th>
                            <th>Partido</th>
                            <th>Maior Despesa</th>
                            <th>Total gasto</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paged.map(d => (
                            <tr key={d.id}>
                                <td>
                                    <img src={`http://www.camara.leg.br/internet/deputado/bandep/${d.ide_cadastro}.jpg`} 
                                        alt={`Foto de ${d.nome_parlamentar}`} 
                                        className={styles.avatar} />
                                </td>
                                <td>{d.nome_parlamentar}</td>
                                <td>{d.sg_partido}</td>
                                <td>{currency.format(d.maior_despesa)}</td>
                                <td>{currency.format(d.total_gastos)}</td>
                                <td>
                                    <Link to={`/deputados/${d.id}/despesas`} className={styles.detailButton}>
                                        Verificar Gastos
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {paged.length === 0 && (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center', padding: '1rem' }}>
                                    Nenhum deputado encontrado
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className={styles.pagination}>
                <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className={styles.button}
                >
                    Primeira
                </button>

                <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={styles.button}
                >
                    Anterior
                </button>

                <span>
                    Página {currentPage} de {totalPages}
                </span>

                <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className={styles.button}
                >
                    Próxima
                </button>

                <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className={styles.button}
                >
                    Última
                </button>
            </div>
        </div>
    );
}
