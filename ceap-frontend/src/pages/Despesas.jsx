import React from "react";
import { useEffect, useState, useLayoutEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from '../services/api';
import styles from './Despesas.module.css';

const currency = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
});

export default function Despesa() {
    useLayoutEffect(() => window.scrollTo(0, 0));

    const { id } = useParams();
    const navigate = useNavigate();
    const [despesas, setDespesas] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        api.get(`/deputados/${id}/despesas`)
            .then(res => setDespesas(res.data))
            .catch(console.error);
    }, [id]);

    const maior = despesas[0]; //Conforme ordenação, primeira despesa já é a maior despesa de cada deputado

    const totalPages = Math.ceil(despesas.length / pageSize);
    const start = (currentPage - 1) * pageSize;
    const paged = despesas.slice(start, start + pageSize);

    useEffect(() => {
        setCurrentPage(1);
    }, [pageSize]);

    return (
        <div className={styles.container}>
            {maior && (
                <div className={styles.card}>
                    <img 
                        src={`http://www.camara.leg.br/internet/deputado/bandep/${maior.ide_cadastro}.jpg`}
                        alt={`Foto de ${maior.nome_parlamentar}`}
                        className={styles.avatarLarge}
                    />
                    <div className={styles.cardInfo}>
                        <h3 className={styles.cardName}>{maior.nome_parlamentar}</h3>
                        <p className={styles.cardLine}>
                            <strong>Maior Despesa:</strong> {currency.format(maior.vlr_liquido)}
                        </p>
                        <p className={styles.cardLine}>
                            <strong>Fornecedor:</strong> {maior.txt_fornecedor}
                        </p>
                        <p className={styles.cardLine}>
                            <strong>Quantidade total de despesas:</strong> {despesas.length}
                        </p>
                    </div>
                </div>
            )}

            <div className={styles.pageSizeSet}>
                <label htmlFor="pageSize">Linhas Por página:</label>
                <select
                    id="pageSize"
                    value={pageSize}
                    onChange={e => setPageSize(Number(e.target.value))}
                >
                    {[10, 20, 30, 40, 50].map(n => (
                        <option key={n} value={n}>{n}</option>
                    ))}
                </select>
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Data</th>
                            <th>Fornecedor</th>
                            <th>Valor</th>
                            <th>Nota</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paged.map(d => (
                            <tr key={d.id}>
                                <td>{new Date(d.dat_emissao).toLocaleDateString()}</td>
                                <td>{d.txt_fornecedor}</td>
                                <td>{currency.format(d.vlr_liquido)}</td>
                                <td>
                                    {d.url_documento ? (
                                        <a href={d.url_documento} className={styles.detailButton} target="_blank" rel="noopener noreferrer">
                                            Ver Nota
                                        </a>
                                    ) : (
                                        <button className={styles.noNote} disabled>
                                            Sem Nota Fiscal
                                        </button>
                                    )
                                    }
                                </td>
                            </tr>
                        ))}
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

            <div className={styles.navigation}>
                <button
                    className={styles.homeButton}
                    onClick={() => navigate("/")}
                >
                    Home
                </button>
                <button
                    className={styles.backButton}
                    onClick={() => navigate(-1)}
                >
                    Voltar
                </button>
            </div>
        </div>
    );
}
