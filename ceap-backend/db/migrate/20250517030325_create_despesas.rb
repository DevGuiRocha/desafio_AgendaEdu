class CreateDespesas < ActiveRecord::Migration[7.1]
  def change
    create_table :despesas do |t|
      t.references :deputado, null: false, foreign_key: true
      t.date :dat_emissao
      t.integer :num_mes
      t.integer :num_ano

      t.integer :num_sub_conta
      t.string :txt_descricao
      t.integer :num_especificacao_subcota
      t.string :txt_descricao_especificacao

      t.string :txt_fornecedor
      t.string :txt_cnpj_cpf
      t.string :txt_numero
      t.integer :ind_tipo_documento
      t.integer :ide_documento

      t.decimal :vlr_documento, precision: 15, scale: 2
      t.decimal :vlr_glosa, precision: 15, scale: 2
      t.decimal :vlr_liquido, precision: 15, scale: 2

      t.integer :num_parcela
      t.string :txt_passageiro
      t.string :txt_trecho
      t.integer :num_lote
      t.float :num_ressarcimento
      t.datetime :dat_pagamento_restituicao
      t.decimal :vlr_restituicao, precision: 15, scale: 2

      t.timestamps
    end
  end
end
