/**
 * 要手机访问必须查询自己得ip地址,修改下面得 localhost 这个为你得IP 地址就可以了
 * 命令行：ipconfig | findStr -l "IPv4"
 * 或者 ipconfig  也可以查询出来
 * 如查询出来得是：192.168.0.100
 * 则将 localhost:8088 改成：192.168.0.100:8088
 * @type {string}
 */
const remoteHost = "localhost:8088";
/**
 * 假设这是服务器获取的数据
 */

const constants = {
  host:'http://'+remoteHost+'/api',
  fileHost:'http://'+remoteHost
}

module.exports =  constants

