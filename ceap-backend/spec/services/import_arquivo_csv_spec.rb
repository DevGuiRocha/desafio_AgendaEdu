# spec/services/import_arquivo_csv_spec.rb
require 'rails_helper'
require 'tempfile'

RSpec.describe ImportArquivoCsv, type: :service do
  # Helper para criar um CSV temporário e chamar o serviço
  def run_import_with(csv_content)
    Tempfile.open(['ceap', '.csv']) do |file|
      file.write(csv_content)
      file.flush
      ImportArquivoCsv.call(file.path)
    end
  end

  let(:base_header) do
    %w[
      sgUF ideCadastro txNomeParlamentar cpf sgPartido nuCarteiraParlamentar
      nuLegislatura codLegislatura nuDeputadoId ideDocumento datEmissao numMes
      numAno numSubCota txtDescricao txtDescricaoEspecificacao txtFornecedor
      txtCNPJCPF txtNumero indTipoDocumento vlrDocumento vlrGlosa vlrLiquido
      numParcela txtPassageiro txtTrecho numLote numRessarcimento
      datPagamentoRestituicao vlrRestituicao urlDocumento
    ].join(';')
  end

  before(:each) do
    # Garante um ambiente limpo
    Deputado.delete_all
    Despesa.delete_all
  end

  describe "Linha válida" do
    let(:csv) do
      <<~CSV
        #{base_header}
        CE;100;Nome Teste;11122233344;PT;0001;2023;58;500;900;2024-01-15;1;2024;1;Categoria;Sub;Fornecedor LTDA;12345678000199;N123;0;200.00;0.00;200.00;1;;; ; ; ; ;http://doc.jpg
      CSV
    end

    it "Cria um deputado e uma despesa com atributos corretos" do
      expect { run_import_with(csv) }
        .to change { Deputado.count }.from(0).to(1)
        .and change { Despesa.count }.from(0).to(1)

      dep = Deputado.last
      expect(dep.ide_cadastro).to eq(100)
      expect(dep.nome_parlamentar).to eq("Nome Teste")
      expect(dep.sg_uf).to eq("CE")

      desp = Despesa.last
      expect(desp.deputado).to eq(dep)
      expect(desp.dat_emissao).to eq(Date.parse("2024-01-15"))
      expect(desp.vlr_liquido).to eq(200.00)
      expect(desp.url_documento).to eq("http://doc.jpg")
    end
  end

  describe "Registros de outro estado" do
    let(:csv) do
      <<~CSV
        #{base_header}
        SP;1;A;111;X;0001;2023;58;1;10;2024-02-01;2;2024;1;Cat;Sub;F;111;N;0;50;0;50;1;;; ; ; ; ;http://a
        CE;2;B;222;Y;0002;2023;58;2;20;2024-02-02;2;2024;1;Cat;Sub;G;222;N;0;60;0;60;1;;; ; ; ; ;http://b
      CSV
    end

    it "Ignora linhas com sgUF != 'CE'" do
      expect { run_import_with(csv) }
        .to change { Deputado.count }.from(0).to(1)
        .and change { Despesa.count }.from(0).to(1)

      expect(Deputado.pluck(:ide_cadastro)).to eq([2])
    end
  end

  describe "Linha sem datEmissao" do
    let(:csv) do
      <<~CSV
        #{base_header}
        CE;10;SemData;333;Z;0003;2023;58;3;30;;3;2024;1;Cat;Sub;H;333;N;0;70;0;70;1;;; ; ; ; ;http://h
      CSV
    end

    it "Salva o deputado mas pula a despesa" do
      expect(Rails.logger).to receive(:warn).with(/Ignorando despesa ideDocumento=30 por datEmissao inválida/)
      expect { run_import_with(csv) }
        .to change { Deputado.count }.by(1)
        .and change { Despesa.count }.by(0)
    end
  end

  describe "Linha com vlrLiquido negativo" do
    let(:csv) do
      <<~CSV
        #{base_header}
        CE;20;Negativo;444;W;0004;2023;58;4;40;2024-03-01;3;2024;1;Cat;Sub;I;444;N;0;80;0;-5.00;1;;; ; ; ; ;http://i
      CSV
    end

    it "Salva o deputado, mas pula a despesa com warn" do
      expect(Rails.logger).to receive(:warn).with(/Ignorando despesa ideDocumento=40 por vlrLiquido menor que zero/)
      expect { run_import_with(csv) }
        .to change { Deputado.count }.by(1)
        .and change { Despesa.count }.by(0)
    end
  end

  describe "Idempotência (create vs update)" do
    let(:csv1) do
      <<~CSV
        #{base_header}
        CE;30;Dup1;555;V;0005;2023;58;5;50;2024-04-01;4;2024;1;Cat;Sub;For1;555;N;0;90;0;90;1;;; ; ; ; ;http://1
      CSV
    end
    let(:csv2) do
      <<~CSV
        #{base_header}
        CE;30;Dup1 Atualizado;555;V;0005;2023;58;5;50;2024-04-01;4;2024;1;Cat;Sub;For2;555;N;0;90;0;90;1;;; ; ; ; ;http://2
      CSV
    end

    it "Não duplica a despesa e atualiza campo" do
      run_import_with(csv1)
      expect(Despesa.count).to eq(1)
      expect(Despesa.last.txt_fornecedor).to eq("For1")

      run_import_with(csv2)
      expect(Despesa.count).to eq(1)
      expect(Despesa.last.txt_fornecedor).to eq("For2")
    end
  end

  describe "Cenário misto contendo sucesso e erros" do
    let(:csv) do
      <<~CSV
        #{base_header}
        CE;40;OK;666;T;0006;2023;58;6;60;2024-05-01;5;2024;1;Cat;Sub;X;666;N;0;100;0;100;1;;; ; ; ; ;http://x
        CE;41;NoDate;777;T;0007;2023;58;7;70;;6;2024;1;Cat;Sub;Y;777;N;0;110;0;110;1;;; ; ; ; ;http://y
        CE;42;Neg;888;T;0008;2023;58;8;80;2024-06-01;6;2024;1;Cat;Sub;Z;888;N;0;120;0;-130;1;;; ; ; ; ;http://z
      CSV
    end

    it "Importa apenas a linha válida e contabiliza corretamente" do
      expect(Rails.logger).to receive(:warn).with(/ideDocumento=70 por datEmissao inválida/)
      expect(Rails.logger).to receive(:warn).with(/ideDocumento=80 por vlrLiquido menor que zero/)

      expect { run_import_with(csv) }
        .to change { Deputado.count }.by(3)
        .and change { Despesa.count }.by(1)
    end
  end
end
