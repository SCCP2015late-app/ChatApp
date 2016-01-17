#coding:UTF-8

require 'sinatra'
require 'json'

class Group
  def initialize(id, name, owner, member_num)
    @id = id
    @name = name
    @owner = owner
    @member_num = member_num
  end

  def toJson()
    JSON.generate({:id => @id, :name => @name, :owner => @owner.toHash, :member_num => @member_num})
  end

  def self.fromJson(json_str)
    group_hash = JSON.parse(json_str)
    owner = Member.fromHash(group_hash['owner'])
    Group.new(group_hash['id'], group_hash['name'], owner, group_hash['member_num'])
  end
end

class Member
  def initialize(id, name, email)
    @id = id
    @name = name
    @email = email
  end

  def toHash()
    {:id => @id, :name => @name, :email => @email}
  end

  def self.fromHash(hash)
    Member.new(hash['id'], hash['name'], hash['email'])
  end
end

module GroupManager extend self
  def initManager()
    @@groups = nil
  end

  def addNewGroup(group)
    if @@groups == nil then
      @@groups = Array[group]
    else
      @@groups << group 
    end
  end

  def getGroupNum()
    @@groups.length
  end

  def getGroupList()
    @@groups
  end
end

GroupManager.initManager()

set :bind, '0.0.0.0'
set :port, 19810

get '/groupSample' do
  Group.new('gid', 'gname', Member.new('mid', 'mname', 'memail'), 3).toJson
end

post '/addNewGroup' do
  begin
    new_group = Group.fromJson(request.body.read)
    GroupManager.addNewGroup(new_group)
    p GroupManager.getGroupNum
    p GroupManager.getGroupList()
    '1'
  rescue
    '0'
  end
end
