require "csv"

class ImportArquivoCsv
  def self.call(file_path)
    new(file_path).import!
  end

  def initialize(file_path)
    @file_path = file_path
  end

  def import!
    sucesso = 0
    erro_valor = 0
    erro_data = 0

    csv_options = { headers: true, col_sep: ";", encoding: "bom|utf-8" }
    CSV.foreach(@file_path, **csv_options) do |row|
      next unless row["sgUF"] == "CE"

      deputado = Deputado.find_or_initialize_by(ide_cadastro: row["ideCadastro"].to_i)

      deputado.nome_parlamentar = row["txNomeParlamentar"]
      deputado.cpf = row["cpf"].to_s
      deputado.sg_uf = row["sgUF"]
      deputado.sg_partido = row["sgPartido"]
      deputado.nu_carteira_parlamentar = row["nuCarteiraParlamentar"]
      deputado.nu_legislatura = row["nuLegislatura"].to_i
      deputado.cod_legislatura = row["codLegislatura"].to_i
      deputado.nu_deputado_id = row["nuDeputadoId"].to_i
      
      deputado.save! if deputado.changed?

      despesa = Despesa.find_or_initialize_by(
        deputado: deputado,
        ide_documento: row["ideDocumento"].to_i
      )

      if row["datEmissao"].present?
        despesa.dat_emissao = Date.parse(row["datEmissao"])
      else
        Rails.logger.warn "Ignorando despesa ideDocumento=#{row['ideDocumento']} por datEmissao inválida"
        erro_data += 1
        next
      end

      despesa.num_mes = row["numMes"].to_i
      despesa.num_ano = row["numAno"].to_i
      despesa.num_sub_cota = row["numSubCota"].to_i
      despesa.txt_descricao = row["txtDescricao"]
      despesa.num_especificacao_subcota = row["numExpecificacaoSubcota"].to_i
      despesa.txt_descricao_especificacao = row["txtDescricaoEspecificacao"]
      despesa.txt_fornecedor = row["txtFornecedor"]
      despesa.txt_cnpj_cpf = row["txtCNPJCPF"]
      despesa.txt_numero = row["txtNumero"]
      despesa.ind_tipo_documento = row["indTipoDocumento"].to_i
      despesa.ide_documento = row["ideDocumento"].to_i
      despesa.vlr_documento = row["vlrdocumento"].to_d
      despesa.vlr_glosa = row["vlrGlosa"].to_d

      if row["vlrLiquido"].to_d >= 0
        despesa.vlr_liquido = row["vlrLiquido"].to_d
      else
        Rails.logger.warn "Ignorando despesa ideDocumento=#{row['ideDocumento']} por vlrLiquido menor que zero"
        erro_valor += 1
        next
      end

      despesa.num_parcela = row["numParcela"].to_i
      despesa.txt_passageiro = row["txtPassageiro"]
      despesa.txt_trecho = row["txtTrecho"]
      despesa.num_lote = row["numLote"].to_i
      despesa.num_ressarcimento = row["numRessarcimento"].to_f
      despesa.dat_pagamento_restituicao = row["datPagamentoRestituicao"].present? ? DateTime.parse(row["datPagamentoRestituicao"]) : nil
      despesa.vlr_restituicao = row["vlrRestituicao"].to_d

      despesa.save! if despesa.changed?

      sucesso += 1
    end

    Rails.logger.info "Importação realizada com sucesso para #{@file_path}. #{sucesso} sucesso, #{erro_data} com erro de data e #{erro_valor} com valor líquido menor que zero"
  end
end
