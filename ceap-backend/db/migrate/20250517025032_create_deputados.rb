class CreateDeputados < ActiveRecord::Migration[7.1]
  def change
    create_table :deputados do |t|
      t.integer :ide_cadastro
      t.string :nome_parlamentar
      t.string :cpf
      t.string :sg_uf
      t.string :sg_partido
      t.string :nu_carteira_parlamentar
      t.integer :nu_legislatura
      t.integer :cod_legislatura
      t.integer :nu_deputado_id

      t.timestamps
    end
  end
end
