import * as Utils from 'utils/utils'

/** max items in history */
const h_max = 100 

/**@ignore */
const deposit = {
 	player_deposit: false,
	bankroller_deposit: false
}
/**@ignore */
const balance = {
	player_balance: 0,
	bankroller_balanceB: 0
}
/**@ignore */
let _profit  = 0
/** Game history  */
let _history = []





/**
 * Class for change Payment Channel Contract state.
 *
 * Instanse of this class, autoinject in your logic 
 * Lib automatically send transactions to [payment channel ethereum contract](https://github.com/DaoCasino/Template/blob/master/contracts/examples/paymentChannel.sol) 
 * all as you need is fixing change user balance with .addTX method.
 * Also you can get current state getBalance getDeposit or printLog for debug.
 * 
 * ## what is paychannel
 * Payment Channel Contract is class of techniques designed to allow users to make multiple transactions without commiting all of the transactions to the block chain. In a payment channel, only two transactions are added to the block chain but an unlimited or nearly unlimted number of payments can be made between the participants. 
 * 
 * @export
 * @class PayChannel
 * @extends {DApp}
 */
export default class PayChannel {
	/**
	 * @ignore
	 */
	constructor(bankroller_deposit) {
		deposit.bankroller_deposit = bankroller_deposit

		console.groupCollapsed('payChannel injected in DApp logic')
		console.log('Now your logic has methods for work with payment channel')
		console.table({
			getDeposit : 'for get start deposit',
			getBalance : 'current user balance',
			getProfit  : 'How many user up, balance-deposit',

			addTX : 'Change current user balance, ex: addTX(-1) ',

			printLog: 'console.log channel state'
		})
		console.groupEnd()
	}
	
	/**
	 * Change deposit  for game
	 * 
	 * @example
	 * window.MyDApp.logic.payChannel.setDeposit(1)
	 * 
	 * > PayChannel::User deposit set 100000000, now user balance: 100000000
	 * > 100000000
	 * 
	 * @param {Number} d - number value to set deposit
	 * @returns {Number} - New deposit
	 * 
	 * @memberOf PayChannel
	 */
	setDeposit(d){

		if (deposit.player_deposit!==false) {
			console.error('Deposit allready set')
			return
		}

		deposit.player_deposit = Utils.bet2dec(d)

		balance.player_balance = (1*deposit.player_deposit)
		balance.bankroller_balance = (1*deposit.bankroller_deposit)
		
		console.log('PayChannel::User deposit set '+deposit.player_deposit+' bankroller deposit set' + deposit.bankroller_deposit +', now user balance:', deposit.player_balance)
		return balance
	}

	/**
	 * View deposit for game
	 * 
	 * @example
	 * window.MyDApp.logic.payChannel.getDeposit()
	 * 
	 * > PayChannel::getDeposit: 1
	 * 
	 * @returns {Number} - Game deposit 
	 * 
	 * @memberOf PayChannel
	 */
	getDeposit(){ 
		console.log('PayChannel::getDeposit', deposit.player_deposit)
		return Utils.dec2bet(deposit.player_deposit) 
	}

	/**
	 * view game balance 
	 * 
	 * @example
	 * window.MyDApp.logic.payChannel.getBalance()
	 * 
	 * > PayChannel::getBalance: 1
	 * 
	 * @returns {Number} - Game balance 
	 * 
	 * @memberOf PayChannel
	 */
	getBalance(){ 
		console.log('PayChannel::getBalance', balance.player_balance)
		return Utils.dec2bet(balance.player_balance) 
	}

	getBankrollBalance() {
		console.log('PayChannel::getBankrollBalance', balance.bankroller_balance)
		return Utils.dec2bet(balance.bankroller_balance)
	}
	
	/**
	 * View game proffit 
	 * 
	 * @example
	 * window.MyDApp.logic.payChannel.getProfit()
	 * 
	 * > PayChannel::getProfit: 0
	 * 
	 * @returns {Number} - Game proffit 
	 * 
	 * @memberOf PayChannel
	 */
	getProfit(){ 
		console.log('PayChannel::getProfit')
		return Utils.dec2bet(_profit)  
	}
	
	/**
	 * @ignore 
	 */
	_getProfit(){ 
		console.log('PayChannel::_getProfit')
		return _profit 
	}


	/**
	 * Add BET transaction to channel
	 *
	 * @example
	 * .payChannel.addTX( 1 )
	 * .payChannel.addTX( +2 )
	 * .payChannel.addTX( '2.5' )
	 * .payChannel.addTX( -2.5 )
	 * 
	 * .payChannel.printLog( -2.5 )
	 * 
	 * @param {string|int} profit - TX value in BETs
	 * @param {bool} convert - convet from BET to microbet, default - true
	 */
	addTX(p, convert=true){
		console.log('PayChannel::addTX')
		if (convert) {
			p = Utils.bet2dec(p)
			console.log('PayChannel::addTX - convert BET to minibet', p)
		}
		if ((''+p).indexOf('.') > -1) {
			throw new Error('addTX '+p+' invalid value, set convert param to true')
		}

		_profit += p*1
		balance.player_balance = deposit.player_deposit + _profit
		balance.bankroller_balance = deposit.bankroller_deposit - _profit

		_history.push({
			profit    : p,
			balance   : balance.player_balance,
			timestamp : new Date().getTime(),
		})

		_history = _history.splice(-h_max)
		return Utils.dec2bet(_profit)  
	}

	/**
	 * Print log in console
	 * 
	 * @example
	 * window.MyDApp.logic.payChannel.printLog()
	 * 
	 * @return {Array} - history array
	 */
	printLog(){
		console.groupCollapsed('Paychannel state:')
		console.table({
			Deposit : this.getDeposit() ,
			Balance : this.getBalance() ,
			Profit  : this.getProfit()  ,
			Bankroll: this.getBankrollBalance()
		})
		console.groupCollapsed('TX History, last '+h_max+' items '+_history.length)
		console.log(_history)
		console.groupEnd()
		console.groupEnd()

		return _history
	}

	/**
	 * Reset balance, depot and proffit game
	 * @example
	 * window.MyDApp.logic.payChannel.reset()
	 * 
	 * > 'PayChannel::reset, set deposit balance profit to 0'
	 * 
	 * @memberOf PayChannel
	 */
	reset(){
		console.log('PayChannel::reset, set deposit balance profit to 0')
		deposit.player_deposit = false
		deposit.bankroller_deposit = false
		balance.player_balance = 0
		balance.bankroller_balance = 0
		_profit  = 0
		_history.push({reset:true, timestamp:new Date().getTime()})
	}
}