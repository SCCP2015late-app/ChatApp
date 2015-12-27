# coding: utf-8

$: << File.expand_path('../', __FILE__)

require 'socket'

port = 33333

server_port = 22222

while true do
  udps = UDPSocket.open()

  udps.bind('127.0.0.1', port)

  mo = udps.recv(65535)

  p "Receive: " + mo

  udps.send(mo, 0, '127.0.0.1', server_port)

  udps.close
end
