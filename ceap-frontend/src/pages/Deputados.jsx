import { useEffect, useState } from "react";
import api from '../services/api';
import { Link } from 'react-router-dom';
import styles from './Deputados.module.css';

export default function Deputados() {
    const [deputados, setDeputados] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    useEffect(() => {
        api.get('/deputados')
            .then(res => setDeputados(res.data))
            .catch(console.error);
    }, []);

    const totalPages = Math.ceil(deputados.length / pageSize);
    const start = (currentPage - 1) * pageSize;
    const paged = deputados.slice(start, start + pageSize);

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Lista de Deputados (CE)</h2>
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
                                    style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: '50%' }} />
                            </td>
                            <td>{d.nome_parlamentar}</td>
                            <td>{d.sg_partido}</td>
                            <td>R$ {d.maior_despesa.toFixed(2)}</td>
                            <td>R$ {d.total_gastos.toFixed(2)}</td>
                            <td>
                                <Link to={`/deputados/${d.id}/despesas`}>
                                    Verificar Gastos
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

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
