#coding:UTF-8

require 'sinatra'
require 'json'

class Group
  attr_reader :id 

  def initialize(id = '', name = '', owner = Member.new(), member_num = 0)
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
    id = group_hash['id']
    name = group_hash['name']
    owner_hash = group_hash['owner']
    member_num = group_hash['member_num']

    id = '' if id == nil
    name = '' if name == nil
    if owner_hash == nil then
      owner = Member.new()
    else
      owner = Member.fromHash(owner_hash)
    end
    member_num = '' if member_num == nil
    Group.new(id, name, owner, member_num)
  end
end

class Member
  def initialize(id = '', name = '', ip_addr = '', email = '')
    @id = id
    @name = name
    @ip_addr = ip_addr
    @email = email
  end

  def toHash()
    {:id => @id, :name => @name, :ip_addr => @ip_addr, :email => @email}
  end

  def self.fromHash(hash)
    id = hash['id']
    name = hash['name']
    ip_addr = hash['ip_addr']
    email = hash['email']

    id = '' if id == nil
    name = '' if name == nil
    ip_addr = '' if ip_addr == nil
    email = '' if email == nil

    Member.new(id, name, ip_addr, email)
  end
end

module GroupManager extend self
  def initManager()
    @@groups = nil
  end

  def addNewGroup(group)
    raise "GroupID: \"#{group.id}\" is already exists." if GroupManager.existGroupID?(group.id)

    if @@groups == nil then
      @@groups = Array[group]
    else
      @@groups << group 
    end
  end

  def existGroupID?(group_id)
    return false if @@groups == nil

    @@groups.select {|group|
      group.id == group_id
    }.length != 0
  end

  def getGroupNum()
    @@groups.length
  end

  def getGroupList()
    @@groups
  end

  def getGroupListAsJson()
    json = '['
    json += @@groups.map {|group|
      group.toJson
    }.join(', ')
    json += ']'
    json
  end

  def update(target_group)
    changed = false
    tmp = @@groups.map {|group|
      if group.id == target_group.id then
        changed = true
        target_group
      else
        group
      end
    }
  
    raise "GroupID: \"#{target_group.id}\" has not found" if !changed

    @@groups = tmp
  end
end

class Result
  attr_reader :OK, :FAULT

  # Result Code
  @@OK = '1'
  @@FAULT = '0'

  def initialize(code, message)
    @code = code
    @message = message
  end

  def self.MAKE(code, message)
    Result.new(code, message).toJson
  end

  def self.OK(message)
    Result.MAKE(@@OK, message)
  end

  def self.FAULT(message)
    Result.MAKE(@@FAULT, message)
  end

  def toJson()
    JSON.generate({:code => @code, :message => @message})
  end
end

GroupManager.initManager

set :bind, '0.0.0.0'
set :port, 19810

get '/groupSample' do
  Group.new('gid', 'gname', Member.new('mid', 'mname', 'memail'), 3).toJson
end

post '/addNewGroup' do
  begin
    new_group = Group.fromJson(request.body.read)
    GroupManager.addNewGroup(new_group)
    Result.OK('Success') 
  rescue => e
    Result.FAULT(e)
  end
end

get '/groupList' do
  begin
    result = GroupManager.getGroupListAsJson
    Result.OK(result)
  rescue
    Result.FAULR('Server error has occured')
  end
end

post '/updateGroupInfo' do
  begin
    group = Group.fromJson(request.body.read)
    GroupManager.update(group)
    Result.OK('1')
  rescue => e
    Result.FAULT(e)
  end
end
