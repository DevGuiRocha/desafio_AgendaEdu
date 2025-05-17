namespace :import do
  desc "Importa o arquivo CSV da CEAP (Apenas com registros sgUF = CE). "
  task :arquivo_csv, [:file_path] => :environment do |t, args|
    file = ENV["FILE"] || args[:file_path]

    puts "Iniciando a importação de #{file}"
    ImportArquivoCsv.call(file)
    puts "Importação Finalizada com sucesso!"
  end
end
