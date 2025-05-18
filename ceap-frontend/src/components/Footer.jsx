import React from 'react';
import styles from './Footer.module.css';

export default function Footer () {
    return (
        <footer className={styles.footer}>
            <div className={styles.top}>
                <span>© {new Date().getFullYear()} Sistema de colsuta de Despesas Políticas. Todos os direitos reservados</span>
            </div>

            <div className={styles.bottom}>
                Desenvolvido por {' '}
                <a
                    href='https://www.linkedin.com/in/guilherme-rocha-828701b6/'
                    target='_blank'
                    rel='noopener noreferrer'
                    className={styles.link}
                >
                    Guilherme Rocha
                </a>
            </div>
        </footer>
    );
}
