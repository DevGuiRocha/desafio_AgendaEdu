class DeputadosController < ApplicationController
  def index
    deputados = Deputado.where(sg_uf: 'CE')
                        .left_joins(:despesas)
                        .select(
                          'deputados.*, COALESCE(SUM(despesas.vlr_liquido), 0) AS total_despesas, MAX(despesas.vlr_liquido) AS maior_despesa'
                        )
                        .group("deputados.id")

    render json: deputados.map { |d| 
      {
        id: d.id,
        ide_cadastro: d.ide_cadastro,
        nome_parlamentar: d.nome_parlamentar,
        sg_uf: d.sg_uf,
        sg_partido: d.sg_partido,
        maior_despesa: d.maior_despesa.to_f,
        total_gastos: d.total_despesas.to_f
      }
    }
  end
end
