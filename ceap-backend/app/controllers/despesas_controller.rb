class DespesasController < ApplicationController
  def index
    deputado = Deputado.find(params[:deputado_id])
    despesas = deputado.despesas
                        .order_by_value_desc
                        .select(
                          :id, :deputado_id, :dat_emissao, :txt_fornecedor, :vlr_liquido, :url_documento
                        )

    render json: despesas.as_json(
      methods: %i[ide_cadastro nome_parlamentar is_maior_despesa]
    )
  end
end
