#グループ管理サーバ

##クラス構成
###Group
id: String - グループのID  
name: String - グループの表示名  
owner: Member - グループのオーナー情報  
member_num: Integer - オーナーを含めたグループ参加者数  

###Member
id: String - メンバーID  
name: String - メンバーの表示名  
ip_addr: String - バインドしているIPアドレス  
email: String - メンバーのEメールアドレス  

##API
###POST /addNewGroup
Body: GroupのJSON文字列  
Result: 成功すれば"1"、失敗すれば"0"  

管理しているネットワーク上にグループを追加する。  
新しくオーナーになるユーザがグループを新設した時に使用留守。  

###GET /groupList
Body: 未指定  
Result: Group配列のJSON文字列  

追加されたグループ全てのリストを返す。  
参加者がグループを検索する時に使用する。  

###POST /updateGroupInfo
Body: 更新したいGroupのJSON文字列  
Result: 成功すれば"1"、失敗すれば"0"  

追加済みのグループの情報を更新する。  
参加者が増えたなど、グループの変化をグループ管理サーバに伝える時に使用する。  

##これから
*POST /joinGroup*  
Body: 参加したいGroupのIDと自分がバインドしているIPアドレス  
Result: メンバーID  
グループに参加する。  

結果を返すためのクラスの作成

（グループからの脱退、グループの削除）  
