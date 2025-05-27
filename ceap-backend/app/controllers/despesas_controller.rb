class DespesasController < ApplicationController
  def index
    deputado = Deputado.find(params[:deputado_id])
    despesas = deputado.despesas
                        .order_by_value_desc
                        .left_joins(:deputado)
                        .select(
                          :id, :deputado_id, :dat_emissao, :txt_fornecedor, :vlr_liquido, :url_documento, :ide_cadastro, :nome_parlamentar
                        )

    despesas_hash = despesas.map do |d|
      {
        id: d.id,
        deputado_id: d.deputado_id,
        dat_emissao: d.dat_emissao,
        txt_fornecedor: d.txt_fornecedor,
        vlr_liquido: d.vlr_liquido,
        url_documento: d.url_documento,
        ide_cadastro: d.ide_cadastro,
        nome_parlamentar: d.nome_parlamentar
      }
    end

    render json: despesas_hash
  end
end
