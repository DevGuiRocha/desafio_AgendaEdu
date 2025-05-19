import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from '../services/api';
import styles from './Despesas.module.css';

const currency = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
});

export default function Despesa() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [despesas, setDespesas] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    useEffect(() => {
        api.get(`/deputados/${id}/despesas`)
            .then(res => setDespesas(res.data))
            .catch(console.error);
    }, [id]);

    const maior = despesas[0]; //Conforme ordenação, primeira despesa já é a maior despesa de cada deputado

    const totalPages = Math.ceil(despesas.length / pageSize);
    const start = (currentPage - 1) * pageSize;
    const paged = despesas.slice(start, start + pageSize);

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Despesas do Deputado #{id}</h2>
            {maior && (
                <p><strong>Maior Despesa:</strong>
                    {` ${maior.txt_fornecedor} - ${currency.format(maior.vlr_liquido)}`}
                </p>
            )}
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
