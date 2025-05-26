class Despesa < ApplicationRecord
  belongs_to :deputado

  validates :dat_emissao, presence: true
  validates :vlr_liquido, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :txt_fornecedor, presence: true

  delegate :nome_parlamentar, :ide_cadastro, to: :deputado

  scope :order_by_value_desc, -> { order(vlr_liquido: :desc) }

  def maior?
    vlr_liquido == deputado.despesas.maximum(:vlr_liquido)
  end

  alias_attribute :is_maior_despesa, :maior?
end
