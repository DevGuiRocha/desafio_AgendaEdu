import { useEffect, useState } from "react";
import api from '../services/api';
import { Link } from 'react-router-dom';
import styles from './Deputados.module.css';

export default function Deputados() {
    const [deputados, setDeputados] = useState([]);

    useEffect(() => {
        api.get('/deputados')
            .then(res => setDeputados(res.data))
            .catch(console.error);
    }, []);

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Lista de Deputados (CE)</h2>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Foto Deputado</th>
                        <th>Nome Deputado</th>
                        <th>Partido</th>
                        <th>Maior Despesa</th>
                        <th>Total gasto</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {deputados.map(d => (
                        <tr key={d.id}>
                            <td>
                                <img src={`http://www.camara.leg.br/internet/deputado/bandep/${d.ide_cadastro}.jpg`} 
                                    style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: '50%' }} />
                            </td>
                            <td>{d.nome_parlamentar}</td>
                            <td>{d.sg_partido}</td>
                            <td>{d.maior_despesa.toFixed(2)}</td>
                            <td>{d.total_gastos.toFixed(2)}</td>
                            <td>
                                <Link to={`/deputados/${d.id}/despesas`}>
                                    Verificar Gastos
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
