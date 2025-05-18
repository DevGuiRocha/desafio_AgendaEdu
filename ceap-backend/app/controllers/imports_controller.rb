class ImportsController < ApplicationController
  def create
    upload_file = params[:file]

    if upload_file.nil?
      return render json: { error: "Nenhum arquivo enviado" }, status: :bad_request
    end

    temp_path = Rails.root.join("tmp", upload_file.original_filename)
    File.open(temp_path, "wb") { |f| f.write(upload_file.read) }

    ImportArquivoCsv.call(temp_path.to_s)

    render json: { message: 'Upload realizado com sucesso! Importação iniciada automaticamente.' }, status: :accepted
  end
end
