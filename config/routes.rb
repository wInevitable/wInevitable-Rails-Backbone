WInevitable::Application.routes.draw do
  root to: 'static_pages#home'
  get '/cod', to: 'static_pages#cod'
end
