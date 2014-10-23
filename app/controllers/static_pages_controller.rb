class StaticPagesController < ApplicationController
  def home
  end
  def cod
    render layout: false
  end
end
