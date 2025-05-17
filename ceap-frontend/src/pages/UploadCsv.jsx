import { useState } from "react";
import api from '../services/api';

export default function UploadCsv() {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');

    const handleSubmit = async e => {
        e.preventDefault();
        if (!file) return;
        const form = new FormData();
        form.append('file', file);

        try {
            const res = await api.post('/import/arquivo_csv', form, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setMessage(res.data.message || 'Upload realizado com sucesso!');
        } catch (error) {
            setMessage('Erro no upload do arquivo.');
            console.error(error);
        }
    }; 

    return (
        <div>
            <h2>Importar CSV das despesas políticas</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="file"
                    accept=".csv"
                    onChange={e => setFile(e.target.files[0])}
                />
                <button type="submit">Enviar CSV</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}
