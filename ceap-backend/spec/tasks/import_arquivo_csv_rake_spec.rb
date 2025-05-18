require 'rails_helper'
require 'rake'

RSpec.describe "import:arquivo_csv", type: :task do
  # Carrega a task do lib/tasks
  before(:all) do
    Rake.application.rake_require("import_arquivo_csv", [Rails.root.join("lib/tasks").to_s])
    Rake::Task.define_task(:environment)
  end

  let(:task_name) { "import:arquivo_csv" }
  let(:task) { Rake::Task[task_name] }

  before(:each) do
    task.reenable
    allow(ImportArquivoCsv).to receive(:call) 
  end

  context "Quando ENV['FILE'] está definido" do
    let(:file) { "public/Ano-2024-exemplo.csv" }

    before do
      ENV["FILE"] = file
    end

    it "Inicia a importação do arquivo usando o caminho da ENV e chama o service" do
      expect {
        task.invoke
      }.to output(/Iniciando a importação de #{Regexp.escape(file)}/).to_stdout

      expect(ImportArquivoCsv).to have_received(:call).with(file)
    end
  end

  context "Quando file_path é passado como argumento" do
    let(:file) { "spec/fixtures/ceap.csv" }

    before do
      ENV.delete("FILE")
    end

    it "Inicia a importação do arquivo usando o argumento e chama o service" do
      expect {
        task.invoke(file)
      }.to output(/Iniciando a importação de #{Regexp.escape(file)}/).to_stdout

      expect(ImportArquivoCsv).to have_received(:call).with(file)
    end
  end
end
