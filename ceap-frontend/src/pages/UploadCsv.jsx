import { useState, useRef, useLayoutEffect } from "react";
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import styles from './UploadCsv.module.css';

export default function UploadCsv() {
    useLayoutEffect(() => window.scrollTo(0, 0));
    
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const handleSubmit = async e => {
        e.preventDefault();
        if (!file) return;

        setUploading(true);
        setMessage('');

        const form = new FormData();
        form.append('file', file);

        try {
            const res = await api.post('/import/arquivo_csv', form, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setMessage(res.data.message || 'Upload realizado com sucesso!');
            setTimeout(() => navigate('/'), 3000)
        } catch (error) {
            setMessage('Erro no upload do arquivo.');
            console.error(error);
        } finally {
            setUploading(false);
            fileInputRef.current.value = "";
            setFile(null);
        }
    }; 

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Importar CSV das despesas políticas</h2>
            <form className={styles.form} onSubmit={handleSubmit}>
                <input 
                    ref={fileInputRef}
                    className={styles.input}
                    type="file"
                    accept=".csv"
                    onChange={e => setFile(e.target.files[0])}
                    disabled={uploading}
                />
                <button type="submit" className={styles.button} disabled={uploading || !file}>
                    {uploading ? 'Enviando Arquivo...' : 'Enviar CSV'}
                </button>
            </form>
            {message && (
                <p className={styles.message}>
                    {message}
                    <br/>
                    {message.includes("sucesso")
                    ? "Você será redirecionado a tela inicial em 3 segundos..."
                    : ""
                    }
                </p>
            )}
        </div>
    );
}
