require 'rails_helper'
require 'tempfile'
require 'rack/test'

RSpec.describe "Imports", type: :request do
  let(:url) { "/import/arquivo_csv" }

  context "Sem enviar nenhum tipo de arquivo" do
    it "Retorna status 400 Bad Request com erro" do
      post url
      expect(response).to have_http_status(:bad_request)
      expect(JSON.parse(response.body)).to eq(
        "error" => "Nenhum arquivo enviado"
      )
    end
  end

  context "Com arquivo enviado" do
    it "Grava o arquivo enviado, chama o service e retorna status 202" do
      # Prepara um CSV temporário
      csv_content = "sgUF;ideCadastro;txNomeParlamentar;cpf;sgPartido;nuCarteiraParlamentar;nuLegislatura;codLegislatura;nuDeputadoId;ideDocumento;datEmissao;numMes;numAno;numSubCota;txtDescricao;txtDescricaoEspecificacao;txtFornecedor;txtCNPJCPF;txtNumero;indTipoDocumento;vlrDocumento;vlrGlosa;vlrLiquido;urlDocumento\n" \
                    "CE;1;Nome;111;P;0001;2023;58;10;100;2024-01-01;1;2024;1;Cat;Sub;F;111;N;0;100;0;100;http://doc"
      temp = Tempfile.new(['ceap', '.csv'])
      temp.write(csv_content)
      temp.flush
      uploaded = Rack::Test::UploadedFile.new(temp.path, 'text/csv')

      # Stub do service para não rodar a importação de verdade
      allow(ImportArquivoCsv).to receive(:call)

      post url, params: { file: uploaded }

      # Verifica que o arquivo foi passado corretamente ao service
      expected = Rails.root.join("tmp", uploaded.original_filename).to_s
      expect(ImportArquivoCsv).to have_received(:call).with(expected)

      # Resposta HTTP e JSON
      expect(response).to have_http_status(:accepted)
      expect(JSON.parse(response.body)).to eq(
        "message" => "Importação iniciada"
      )
    ensure
      temp.close
      temp.unlink
    end
  end
end
