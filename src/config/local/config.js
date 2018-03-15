module.exports = {
  upd : '17.10.2017',

  wallet_pass : '1234',

  db_name   : 'DCLib',
  rtc_room  : 'dc-room1',
  rtc_store : 'rtc_msgs',
  logname   : 'dclib',
  loglevel  : 'hight',

  network: 'local',
  rpc_url: 'http://localhost:9545/',
  api_url: 'http://localhost:8181/',

  contracts: {
    erc20: {
      address : require('contracts.json').ERC20,
      abi     : require('contracts/ERC20.json').abi
    }
  },

  gasPrice : 40 * 1000000000,
  gasLimit : 40 * 100000
}
