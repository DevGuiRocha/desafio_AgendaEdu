class DeputadosController < ApplicationController
  def index
    render json: Deputado.index_data('CE')
  end
end
