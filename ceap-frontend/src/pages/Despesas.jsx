import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from '../services/api';

export default function Despesa() {
    const { id } = useParams();
    const [despesa, setDespesas] = useState([]);

    useEffect(() => {
        api.get(`/deputados/${id}/despesas`)
            .then(res => setDespesas(res.data))
            .catch(console.error);
    }, [id]);

    const maior = despesa[0]; //Conforme ordenação, primeira despesa já é a maior despesa de cada deputado

    return (
        <div>
            <h2>Despesas do Deputado #{id}</h2>
            {maior && (
                <p><strong>Maior Despesa:</strong>
                    {` ${maior.txt_fornecedor} - R$ ${maior.vlr_liquido.toFixed(2)}`}
                </p>
            )}
            <table>
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>Fornecedor</th>
                        <th>Valor</th>
                        <th>Nota</th>
                    </tr>
                </thead>
                <tbody>
                    {setDespesas.map(d => (
                        <tr key={d.id}>
                            <td>{new Date(d.dat_emissao).toLocaleDateString()}</td>
                            <td>{d.txt_fornecedor}</td>
                            <td>R$ {d.vlr_liquido.toFixed(2)}</td>
                            <td>
                                <a href={false.url_documento} target="_blank" rel="noopener noreferrer">
                                    Ver Nota
                                </a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
