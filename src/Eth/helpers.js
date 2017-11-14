import _config    from 'config/config'
import Acc        from 'Eth/Account'
import * as Utils from 'utils/utils'

const Account = new Acc( _config, ()=>{}, false )
const web3    = Account.web3


/**
 * Class with some helpers 
 * 
 * @export
 * @class EthHelpers
 * @extends {DCLib}
 */
export default class EthHelpers {
	constructor() {
		
		/**
		 * ERC20
		 * This is web3.eth.contract instanse of our [ERC20 contract](https://ropsten.etherscan.io/address/0x95a48dca999c89e4e284930d9b9af973a7481287#code)
		 * 
		 * @see https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20-token-standard.md 
		 */
		this.ERC20 = new web3.eth.Contract(
			_config.contracts.erc20.abi, 
			_config.contracts.erc20.address 
		)
	}

	/**
	 * This callback is 
	 * @callback accessBalance
	 * @param {Object} receipt - access balance information
	 */	

	/**
	 * ## Getting balances for Bets and Ethereum
	 *  
	 * @param {String} address - Addres Ethereum account wallet
	 * @param {accessBalance} callback - callback function then access balance information
	 * @returns {Object} - return balance information  
	 * 
	 * @example
	 * > DCLib.getBalances('0x4d750610062f1b3ce35117ee3e19cfb657ef6e59') // '0x4d75..' address account 
	 *
	 * @example
	 * // method return
	 * Object {
	 * 		 bets : 992.21
	 * 		 eth  : "1.748053851"
	 * }
	 * 
	 * @memberOf DCLib
	 */
	async getBalances(address, callback=false){
		const [bets, eth] = await Promise.all([
			this.getBetBalance( address ),
			this.getEthBalance( address )
		])
		
		const res = { bets:bets, eth:eth }
		
		if (callback) callback( res )
		return res
	}
	

	/**
	 * ## DCLib.getBetBalance
	 * method need for getting balance in ETH
	 * 
	 * @example
	 * > DCLib.getEthBalance('0x4d750610062f1b3ce35117ee3e19cfb657ef6e59')
	 * 
	 * @example
	 * // method return
	 * 
	 * Promise {[[PromiseStatus]]: "pending", [[PromiseValue]]: undefined}
	 *   [[PromiseStatus]]: "resolved"
	 *   [[PromiseValue]]: 1.692211283
	 * 
	 * @param {String} [address=false] - account addres for check balance
	 * @param {Function} [callback=false] - access Ethereum balance promise  
	 * @returns {Promise} - ETH balance
	 * 
	 * @memberOf DCLib
	 */
	getEthBalance(address=false, callback=false){
		if (!address) return
		
		return new Promise((resolve, reject) => {

			web3.eth.getBalance(address).then(value => {
				const balance = web3.utils.fromWei(value)
				resolve( balance )
				if(callback) callback( balance )
			}).catch( err => {
				console.error(err)
				reject(err)
			})
		})
	}

	/**
	 * ## DCLib.getBetBalance
	 * method need for getting balance in BET
	 * 
	 * @example
	 * // example for method initialization
	 * 
	 * > DCLib.getBetBalance('0x4d750610062f1b3ce35117ee3e19cfb657ef6e59')
	 * 
	 * @example
	 * // example for method return Promise
	 * 
	 * Promise {[[PromiseStatus]]: "pending", [[PromiseValue]]: undefined}
	 *   [[PromiseStatus]]: "resolved"
	 *   [[PromiseValue]]: 977.61
	 * 
	 * @param {String} [address=false] - account addres for check balance
	 * @param {Function} [callback=false] - access Ethereum balance promise  
	 * @returns {Promise} - BET balance
	 * 
	 * @memberOf DCLib
	 */
	getBetBalance(address=false, callback=false){
		if (!address) return
		
		return new Promise((resolve, reject) => {
			
			this.ERC20.methods.balanceOf(address).call().then( value => {
				const balance = Utils.bet2dec(value) 
				resolve( balance )
				if(callback) callback( balance )
			}).catch( err => {
				console.error(err)
				reject(balance)
			})
		})
	}

	/**
	 * Check ERC20 allowance and approve if need
	 * 
	 * @param {string} spender - bytes32 addres
	 * @param {int} amount - amount of BETs
	 * @param {callback} 
	 */
	async ERC20approve(spender, amount, callback=false){
		return new Promise(async (resolve, reject) => {
			console.log('Check how many tokens user '+Account.get().openkey+' is still allowed to withdraw from contract '+spender+' . . . ')
			
			let allowance = await this.ERC20.methods.allowance( Account.get().openkey, spender).call()

			console.log('💸 allowance:', allowance)

			if (allowance < amount) {
				console.log('allowance lower than need deposit')

				console.group('Call .approve on ERC20')
				console.log('Allow paychannel to withdraw from your account, multiple times, up to the '+amount+' amount.')

				const approve_amount = amount * 9
				
				const gasLimit = await this.ERC20.methods.approve(spender, approve_amount).estimateGas({from : Account.get().openkey})
				
				const receipt = await this.ERC20.methods.approve( 
					spender,
					approve_amount
				).send({
					from     : Account.get().openkey,
					gasPrice : 1.2 * _config.gasPrice,
					gas      : gasLimit,
				}).on('transactionHash', transactionHash=>{
					console.log('# approve TX pending', transactionHash)
					console.log('https://ropsten.etherscan.io/tx/'+transactionHash)
				}).on('error', err=>{ 
					console.error(err)
					reject(false, err)
				})
				
				console.log('📌 ERC20.approve receipt:', receipt)
				
				allowance = await this.ERC20.methods.allowance( Account.get().openkey, spender).call()
	
				console.log('💸💸💸 allowance:', allowance)

				
				console.groupEnd()
				
			}
			
			resolve(true, null)
			if (callback) callback()
		})
	}

}