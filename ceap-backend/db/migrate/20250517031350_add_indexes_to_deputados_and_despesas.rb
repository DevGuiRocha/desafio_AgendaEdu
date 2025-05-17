class AddIndexesToDeputadosAndDespesas < ActiveRecord::Migration[7.1]
  def change
    add_index :deputados, :ide_cadastro, unique: true
    add_index :deputados, :sg_uf
    add_index :despesas, :dat_emissao
    add_index :despesas, :ide_documento
  end
end
