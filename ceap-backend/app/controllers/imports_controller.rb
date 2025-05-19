class ImportsController < ApplicationController
  def create
    upload_file = params[:file]

    if upload_file.nil?
      return render json: { error: "Nenhum arquivo enviado" }, status: :bad_request
    end

    unless File.extname(upload_file.original_filename).casecmp(".csv").zero?
      return render json: { error: "Formato inválido. Apenas arquivos .csv são permitidos." },
                    status: :unsupported_media_type
    end

    temp_path = Rails.root.join("tmp", upload_file.original_filename)
    File.open(temp_path, "wb") { |f| f.write(upload_file.read) }

    ImportArquivoCsv.call(temp_path.to_s)

    render json: { message: 'Upload realizado com sucesso! Importação iniciada automaticamente.' }, status: :accepted
  end
end
