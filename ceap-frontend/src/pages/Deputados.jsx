import { useEffect, useState } from "react";
import api from '../services/api';
import { Link } from 'react-router-dom';

export default function Deputados() {
    const [deputados, setDeputados] = useState([]);

    useEffect(() => {
        api.get('/deputados')
            .then(res => setDeputados(res.data))
            .catch(console.error);
    }, []);

    return (
        <div>
            <h2>Lista de Deputados (CE)</h2>
            <ul>
                {deputados.map(d => (
                    <li key={d.id}>
                        <Link to={`/deputados/${d.id}/despesas`}>
                        {d.nome_parlamentar} - Total gasto: R$ {d.total_gastos.toFixed(2)}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
