import api from './api';

export function getDespesas(id) {
    return api.get(`/deputados/${id}/despesas`)
    .then(res => res.data);
}
