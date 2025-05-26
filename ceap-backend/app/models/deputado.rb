class Deputado < ApplicationRecord
  has_many :despesas, dependent: :destroy

  validates :ide_cadastro, presence: true, uniqueness: true
  validates :cpf, presence: true, uniqueness: true
  validates :nome_parlamentar, presence: true
  validates :sg_uf, presence: true
end
