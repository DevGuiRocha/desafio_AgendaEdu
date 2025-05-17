require 'rails_helper'

RSpec.describe "Despesas", type: :request do
  describe "GET /index" do
    it "returns http success" do
      get "/despesas/index"
      expect(response).to have_http_status(:success)
    end
  end

end
