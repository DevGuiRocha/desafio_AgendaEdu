require 'rails_helper'

RSpec.describe "Imports", type: :request do
  describe "GET /create" do
    it "returns http success" do
      get "/imports/create"
      expect(response).to have_http_status(:success)
    end
  end

end
