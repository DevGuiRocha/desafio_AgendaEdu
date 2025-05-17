# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2025_05_17_031350) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "deputados", force: :cascade do |t|
    t.integer "ide_cadastro"
    t.string "nome_parlamentar"
    t.string "cpf"
    t.string "sg_uf"
    t.string "sg_partido"
    t.string "nu_carteira_parlamentar"
    t.integer "nu_legislatura"
    t.integer "cod_legislatura"
    t.integer "nu_deputado_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["ide_cadastro"], name: "index_deputados_on_ide_cadastro", unique: true
    t.index ["sg_uf"], name: "index_deputados_on_sg_uf"
  end

  create_table "despesas", force: :cascade do |t|
    t.bigint "deputado_id", null: false
    t.date "dat_emissao"
    t.integer "num_mes"
    t.integer "num_ano"
    t.integer "num_sub_conta"
    t.string "txt_descricao"
    t.integer "num_especificacao_subcota"
    t.string "txt_descricao_especificacao"
    t.string "txt_fornecedor"
    t.string "txt_cnpj_cpf"
    t.string "txt_numero"
    t.integer "ind_tipo_documento"
    t.integer "ide_documento"
    t.decimal "vlr_documento", precision: 15, scale: 2
    t.decimal "vlr_glosa", precision: 15, scale: 2
    t.decimal "vlr_liquido", precision: 15, scale: 2
    t.integer "num_parcela"
    t.string "txt_passageiro"
    t.string "txt_trecho"
    t.integer "num_lote"
    t.float "num_ressarcimento"
    t.datetime "dat_pagamento_restituicao"
    t.decimal "vlr_restituicao", precision: 15, scale: 2
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["dat_emissao"], name: "index_despesas_on_dat_emissao"
    t.index ["deputado_id"], name: "index_despesas_on_deputado_id"
    t.index ["ide_documento"], name: "index_despesas_on_ide_documento"
  end

  add_foreign_key "despesas", "deputados"
end
