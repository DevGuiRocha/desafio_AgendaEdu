require 'rails_helper'

RSpec.describe "Despesas", type: :request do
  let(:deputado) { create(:deputado, sg_uf: 'CE') }
  let(:url)       { "/deputados/#{deputado.id}/despesas" }

  context "Quando o deputado não existe" do
    it "Retorna status 404" do
      get "/deputados/99999/despesas"
      expect(response).to have_http_status(:not_found)
    end
  end

  context "Quando não existem despesas para o deputado" do
    it "Retorna status 200 e array vazio" do
      get url
      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)).to eq([])
    end
  end

  context "Quando existem múltiplas despesas" do
    let!(:d1) { create(:despesa, deputado: deputado, vlr_liquido: 100.0, dat_emissao: Date.new(2024,1,1), txt_fornecedor: 'Fornecedor A', url_documento: 'urlA') }
    let!(:d2) { create(:despesa, deputado: deputado, vlr_liquido: 200.0, dat_emissao: Date.new(2024,2,1), txt_fornecedor: 'Fornecedor B', url_documento: 'urlB') }
    let!(:d3) { create(:despesa, deputado: deputado, vlr_liquido: 150.0, dat_emissao: Date.new(2024,3,1), txt_fornecedor: 'Fornecedor C', url_documento: 'urlC') }

    it "Retorna todas as despesas ordenadas por vlr_liquido desc e marca apenas a maior" do
      get url
      expect(response).to have_http_status(:ok)

      body = JSON.parse(response.body)
      valores = body.map { |d| d['vlr_liquido'] }
      expect(valores).to eq(["200.0", "150.0", "100.0"])

      flags = body.map { |d| d['is_maior_despesa'] }
      expect(flags).to eq([true, false, false])

      item = body.first
      expect(item.keys).to contain_exactly(
        'id', 'deputado_id', 'dat_emissao', 'txt_fornecedor', 'vlr_liquido', 'url_documento', 'is_maior_despesa', 'ide_cadastro', 'nome_parlamentar'
      )
      expect(item['id']).to eq(d2.id)
      expect(item['txt_fornecedor']).to eq('Fornecedor B')
      expect(item['url_documento']).to eq('urlB')
      expect(item['dat_emissao']).to eq('2024-02-01')
    end
  end
end
