class RenameNumSubContaToNumSubCotaInDespesas < ActiveRecord::Migration[7.1]
  def change
    rename_column :despesas, :num_sub_conta, :num_sub_cota
  end
end
