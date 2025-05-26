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

    deputados_cache = Deputado.where(sg_uf: 'CE')
                              .pluck(:ide_cadastro, :id)
                              .to_h

    despesas_cache = Despesa.where(deputado_id: deputados_cache.values)
                              .pluck(:deputado_id, :ide_documento, :id)
                              .each_with_object({}) do |(dep_id, doc_id, desp_id), h|
                                h[[dep_id, doc_id]] = desp_id
                              end

    csv_options = { headers: true, col_sep: ";", encoding: "bom|utf-8" }

    CSV.foreach(@file_path, **csv_options) do |row|
      next unless row['sgUF'] == 'CE' && row["datEmissao"].present? && row["vlrLiquido"].to_d >= 0

      ide = row['ideCadastro'].to_i
      dep_id = deputados_cache[ide] || begin
        dep_attrs = {
          ide_cadastro: ide,
          nome_parlamentar: row["txNomeParlamentar"],
          cpf: row["cpf"].to_s,
          sg_uf: row["sgUF"],
          sg_partido: row["sgPartido"],
          nu_carteira_parlamentar: row["nuCarteiraParlamentar"],
          nu_legislatura: row["nuLegislatura"].to_i,
          cod_legislatura: row["codLegislatura"].to_i,
          nu_deputado_id: row["nuDeputadoId"].to_i
        }

        deputado = Deputado.find_or_initialize_by(ide_cadastro: ide)
        deputado.assign_attributes(dep_attrs)
        deputado.save!
        deputados_cache[ide] = deputado.id
      end

      key = [dep_id, row["ideDocumento"].to_i]
      desp_id = despesas_cache[key]

      despesa = desp_id ? Despesa.find(desp_id) : Despesa.new(deputado_id: dep_id, ide_documento: key.last)

      desp_attrs = {
        dat_emissao: Date.parse(row["datEmissao"]),
        num_mes: row["numMes"].to_i,
        num_ano: row["numAno"].to_i,
        num_sub_cota: row["numSubCota"].to_i,
        txt_descricao: row["txtDescricao"],
        num_especificacao_subcota: row["numEspecificacaoSubCota"].to_i,
        txt_descricao_especificacao: row["txtDescricaoEspecificacao"],
        txt_fornecedor: row["txtFornecedor"],
        txt_cnpj_cpf: row["txtCNPJCPF"],
        txt_numero: row["txtNumero"],
        ind_tipo_documento: row["indTipoDocumento"].to_i,
        ide_documento: row["ideDocumento"].to_i,
        vlr_documento: row["vlrDocumento"].to_d,
        vlr_glosa: row["vlrGlosa"].to_d,
        vlr_liquido: row["vlrLiquido"].to_d,
        num_parcela: row["numParcela"].to_i,
        txt_passageiro: row["txtPassageiro"],
        txt_trecho: row["txtTrecho"],
        num_lote: row["numLote"].to_i,
        num_ressarcimento: row["numRessarcimento"].to_f,
        dat_pagamento_restituicao: row["datPagamentoRestituicao"].present? ? DateTime.parse(row["datPagamentoRestituicao"]) : nil,
        vlr_restituicao: row["vlrrestituicao"].to_d,
        url_documento: row["urlDocumento"]
      }

      despesa.assign_attributes(desp_attrs)

      if despesa.valid?
        despesa.save!
        despesas_cache[key] ||= despesa.id
        sucesso += 1
      else
        Rails.logger.warn "Erro na despesa #{key}: #{despesa.errors.full_messages.join(', ')}"
      end
    end
  end
end
