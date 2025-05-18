require 'rails_helper'

RSpec.describe Deputado, type: :model do
  subject { build(:deputado) }

  describe 'Verificação das associações do Model Deputado' do
    it { is_expected.to have_many(:despesas).dependent(:destroy) }
  end

  describe 'Verificação das validações do Model Deputado' do
    it { is_expected.to validate_presence_of(:ide_cadastro) }
    it { is_expected.to validate_uniqueness_of(:ide_cadastro) }
    it { is_expected.to validate_presence_of(:nome_parlamentar) }
    it { is_expected.to validate_presence_of(:sg_uf) }
    it { is_expected.to validate_presence_of(:cpf) }
  end
end
