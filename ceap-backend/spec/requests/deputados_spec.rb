require 'rails_helper'

RSpec.describe "GET /deputados", type: :request do
  let(:url) { "/deputados" }

  context "Quando não existe nenhum deputado cadastrado na base" do
    it "Retorna status 200 e array vazio" do
      get url
      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)).to eq([])
    end
  end

  context "Quando existem deputados com diferentes estados" do
    before do
      create(:deputado, sg_uf: "SP", ide_cadastro: 1, nome_parlamentar: "Deputado 01", cpf: "12345678900")
      create(:deputado, sg_uf: "CE", ide_cadastro: 2, nome_parlamentar: "Deputado 02", cpf: "45678912300")
      create(:deputado, sg_uf: "AM", ide_cadastro: 3, nome_parlamentar: "Deputado 03", cpf: "78912345600")
    end

    it "Retorna apenas deputados do Estado do Ceará (sg_uf = CE)" do
      get url
      body = JSON.parse(response.body)
      expect(body.map { |d| d["sg_uf"] }.uniq).to eq(["CE"])
      expect(body.size).to eq(1)
      expect(body.first["ide_cadastro"]).to eq(2)
      expect(body.first["nome_parlamentar"]).to eq("Deputado 02")
    end
  end

  context "Quando um deputado não possui despesas" do
    let!(:dep) { create(:deputado, sg_uf: "CE", ide_cadastro: 10, nome_parlamentar: "Deputado Sem Despesa") }

    it "Retorna total_gastos = 0 e maior_despesa = 0" do
      get url
      data = JSON.parse(response.body).first
      expect(data["id"]).to eq(dep.id)
      expect(data["total_gastos"]).to eq(0.0)
      expect(data["maior_despesa"]).to eq(0.0)
    end
  end

  context "Quando um deputado possui várias despesas" do
    let!(:dep) { create(:deputado, sg_uf: "CE", ide_cadastro: 20, nome_parlamentar: "Deputado Com Despesas") }

    before do
      create(:despesa, deputado: dep, vlr_liquido: 100.00)
      create(:despesa, deputado: dep, vlr_liquido: 50.00)
      create(:despesa, deputado: dep, vlr_liquido: 199.99)
    end

    it "Retorna totalgastos com soma dos valores e maior_despesa correto" do
      get url
      data = JSON.parse(response.body).first
      expect(data["ide_cadastro"]).to eq(20)
      expect(data["total_gastos"]).to eq(349.99)
      expect(data["maior_despesa"]).to eq(199.99)
    end
  end

  context "Diversos deputados com e sem despesas" do
    let!(:dep1) { create(:deputado, sg_uf: "CE", ide_cadastro: 30, nome_parlamentar: "Deputado XYZ", cpf: "12345678900") }
    let!(:dep2) { create(:deputado, sg_uf: "CE", ide_cadastro: 35, nome_parlamentar: "Deputado ABC", cpf: "98765432100") }

    before do
      create(:despesa, deputado: dep1, vlr_liquido: 10.00)
      create(:despesa, deputado: dep1, vlr_liquido: 20.00)
    end

    it "Inclui cada deputado com seus totais de forma individual" do
      get url
      body = JSON.parse(response.body)
      xyz = body.detect { |d| d["ide_cadastro"] == 30 }
      abc = body.detect { |d| d["ide_cadastro"] == 35 }

      expect(xyz["total_gastos"]).to eq(30.00)
      expect(xyz["maior_despesa"]).to eq(20.00)

      expect(abc["total_gastos"]).to eq(0.00)
      expect(abc["maior_despesa"]).to eq(0.00)

      expect(body.size).to eq(2)
    end
  end
end
