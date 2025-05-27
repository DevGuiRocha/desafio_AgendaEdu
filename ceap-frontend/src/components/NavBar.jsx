import React from 'react';
import { Link } from 'react-router-dom';
import styles from './NavBar.module.css';
import logoImg from '../assets/logo.png';

export default function Navbar() {
    return(
        <nav className={styles.nav}>
            <div className={styles.brand}>
                <img src={logoImg} alt="Logo" className={styles.logo} />
                <span className={styles.title}>Despesas Públicas</span>
            </div>
            <div className={styles.links}>
                <Link to="/" className={styles.link}>Home</Link>
                <Link to="/deputados" className={styles.link}>Consultar Deputados</Link>
                <Link to="/uploadcsv" className={styles.link}>Importar CSV</Link>
            </div>
        </nav>
    );
}