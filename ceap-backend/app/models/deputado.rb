class Deputado < ApplicationRecord
  has_many :despesas, dependent: :destroy

  validates :ide_cadastro, presence: true, uniqueness: true
  validates :cpf, presence: true, uniqueness: true
  validates :nome_parlamentar, presence: true
  validates :sg_uf, presence: true

  scope :por_estado, -> (uf) { where(sg_uf: uf) }

  scope :com_totais, lambda {
    left_joins(:despesas)
      .select(
        "deputados.*",
        "COALESCE(SUM(despesas.vlr_liquido), 0) AS total_despesas",
        "MAX(despesas.vlr_liquido) AS maior_despesa",
        "COUNT(despesas.id) AS qtde_despesa",
      )
      .group("deputados.id")
  }

  scope :ordenar_por_gastos, -> { order("total_despesas DESC") }

  def total_gastos
    (self[:total_despesas] || despesas.sum(:vlr_liquido)).to_f
  end

  def maior_despesa_valor
    (self[:maior_despesa] || despesas.maximum(:vlr_liquido) || 0).to_f
  end
  
  def qtde_despesa
    (self[:qtde_despesa] || despesas.count).to_i
  end

  def as_index_json
    {
      id: id,
      ide_cadastro: ide_cadastro,
      nome_parlamentar: nome_parlamentar,
      sg_uf: sg_uf,
      sg_partido: sg_partido,
      maior_despesa: maior_despesa_valor,
      total_gastos: total_gastos,
      qtde_despesa: qtde_despesa
    }
  end

  def self.index_data(uf = 'CE')
    por_estado(uf)
      .com_totais
      .ordenar_por_gastos
      .map(&:as_index_json)
  end
end
