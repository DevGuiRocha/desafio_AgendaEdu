FactoryBot.define do
  factory :deputado do
    ide_cadastro { 1 }
    nome_parlamentar { "MyString" }
    cpf { "MyString" }
    sg_uf { "MyString" }
    sg_partido { "MyString" }
    nu_carteira_parlamentar { "MyString" }
    nu_legislatura { 1 }
    cod_legislatura { 1 }
    nu_deputado_id { 1 }
  end
end
