import api from './api';

export function getDeputados(uf = 'CE') {
    return api.get('/deputados', {
        params: { uf }
    })
    .then(res => res.data);
}