FactoryBot.define do
  factory :deputado do
    ide_cadastro { 1 }
    nome_parlamentar { "Deputado Teste 01" }
    cpf { "12345678901" }
    sg_uf { "CE" }
    sg_partido { "ABC" }
    nu_carteira_parlamentar { "01" }
    nu_legislatura { 2025 }
    cod_legislatura { 58 }
    nu_deputado_id { 1212 }
  end
end
