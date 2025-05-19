class DespesasController < ApplicationController
  def index
    deputado = Deputado.find(params[:deputado_id])
    despesas = deputado.despesas.order(vlr_liquido: :desc)

    maior_valor = despesas.first

    render json: despesas.map { |d|
      {
        id: d.id,
        nome_parlamentar: deputado.nome_parlamentar,
        ide_cadastro: deputado.ide_cadastro,
        dat_emissao: d.dat_emissao,
        txt_fornecedor: d.txt_fornecedor,
        vlr_liquido: d.vlr_liquido.to_f,
        url_documento: d.url_documento,
        is_maior_despesa: (d.vlr_liquido == maior_valor.vlr_liquido)
      }
    }
  end
end
