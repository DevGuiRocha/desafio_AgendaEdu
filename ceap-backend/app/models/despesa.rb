class Despesa < ApplicationRecord
  belongs_to :deputado

  validates :dat_emissao, presence: true
  validates :vlr_liquido, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :txt_fornecedor, presence: true
end
