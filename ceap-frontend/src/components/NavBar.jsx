import { Link } from 'react-router-dom';

export default function Navbar() {
    return(
        <nav style={{ padding: '1rem', borderBotton: '1px solid #ddd' }}>
            <Link to="/" stryle={{ marginRight: 16 }}>Home</Link>
            <Link to="/deputados" stryle={{ marginRight: 16 }}>Deputados</Link>
            <Link to="/upload" stryle={{ marginRight: 16 }}>Importar CSV</Link>
        </nav>
    );
}