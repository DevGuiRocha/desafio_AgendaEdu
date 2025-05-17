class AddUrlDocumentoToDespesas < ActiveRecord::Migration[7.1]
  def change
    add_column :despesas, :url_documento, :string
    add_index :despesas, :url_documento
  end
end
