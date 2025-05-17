FactoryBot.define do
  factory :despesa do
    deputado { nil }
    dat_emissao { "2025-05-17" }
    num_mes { 1 }
    num_ano { 1 }
    num_sub_conta { 1 }
    txt_descricao { "MyString" }
    num_especificacao_subcota { 1 }
    txt_descricao_especificacao { "MyString" }
    txt_fornecedor { "MyString" }
    txt_cnpj_cpf { "MyString" }
    txt_numero { "MyString" }
    ind_tipo_documento { 1 }
    ide_documento { 1 }
    vlr_documento { 9.99 }
    vlr_glosa { 9.99 }
    vlr_liquido { 9.99 }
    num_parcela { 1 }
    txt_passageiro { "MyString" }
    txt_trecho { "MyString" }
    num_lote { 1 }
    num_ressarcimento { 1.5 }
    dat_pagamento_restituicao { "2025-05-17 00:03:26" }
    vlr_restituicao { 9.99 }
  end
end
