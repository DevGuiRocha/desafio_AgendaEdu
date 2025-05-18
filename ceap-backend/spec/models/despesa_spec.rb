require 'rails_helper'

RSpec.describe Despesa, type: :model do
  subject { build(:despesa) }

  describe 'Verificação das associações do Model Despesa' do
    it { is_expected.to belong_to(:deputado) }
  end

  describe 'Verificação das validações do Model Despesa' do
    it { is_expected.to validate_presence_of(:dat_emissao) }
    it { is_expected.to validate_presence_of(:txt_fornecedor) }

    it do
      is_expected.to validate_numericality_of(:vlr_liquido).is_greater_than_or_equal_to(0)
    end
  end
end
