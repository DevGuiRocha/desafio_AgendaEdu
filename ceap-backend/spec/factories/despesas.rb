FactoryBot.define do
  factory :despesa do
    association :deputado
    dat_emissao { Date.today }
    num_mes { Date.today.month }
    num_ano { Date.today.year }

    num_sub_cota { 1 }
    txt_descricao { "Serviço de teste" }
    num_especificacao_subcota { 1 }
    txt_descricao_especificacao { "Subcategoria de teste" }

    txt_fornecedor { "Fornecedor Confiável" }
    txt_cnpj_cpf { "123456780000199" }
    txt_numero { "A001" }
    ind_tipo_documento { 0 }
    ide_documento { 999 }

    vlr_documento { 100.99 }
    vlr_glosa { 0.00 }
    vlr_liquido { 100.99 }

    num_parcela { nil }
    txt_passageiro { nil }
    txt_trecho { nil }
    num_lote { nil }
    num_ressarcimento { nil }
    dat_pagamento_restituicao { nil }
    vlr_restituicao { nil }
  end
end
