require 'sinatra'

set :bind, '0.0.0.0'
set :port, 19810

get '/' do
  'Hello, World!'
end
