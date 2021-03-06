# [DCLib](https://github.com/DaoCasino/DCLib) 

[![Maintainability](https://api.codeclimate.com/v1/badges/ea47df84b3790c8a0692/maintainability)](https://codeclimate.com/github/DaoCasino/DCLib/maintainability)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/1c2bd80b33b54f1787d93b93be7c765f)](https://www.codacy.com/app/DCLabs/DCLib?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=DaoCasino/DCLib&amp;utm_campaign=Badge_Grade)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)


DCLib is javascript library for integrate [dao.casino blockchain protocol](https://github.com/DaoCasino/Whitepaper).
Interact with [bankroller](https://github.com/DaoCasino/BankRollerApp), use [Signidice random algorithm](https://github.com/DaoCasino/Whitepaper/blob/master/DAO.Casino%20WP.md#35-algorithm-implemented-in-mvp-of-daocasino-protocol), and paymentchannels.

DCLib has two part:
  * browser/frontend library
  * bankroller side API

DCLIb methods available inside bankroller application. 

IMPORTANT: now lib work only in [ropsten](https://ropsten.etherscan.io/) test network.

# Get startted
[See short video](https://www.youtube.com/watch?v=vD2kI_4IEFA) [2](https://youtu.be/HKggfOgGRhI)

[Download and install last BankRollerApp](https://github.com/DaoCasino/BankRollerApp/releases)

[See DApp example](https://github.com/DaoCasino/BankRollerApp/blob/master/DApps/example.zip)


# Usage

## Include JS in your DApp
```
<script src="https://platform.dao.casino/api/lib/v2/DC.js"></script>
```
or use npm 
```
npm install --save dclib
```
```
import 'dclib' // or require('dclib')

console.log(DCLib.version)
```

Open it in browser and see console.

<img src="https://raw.githubusercontent.com/DaoCasino/DCLib/master/manual/asset/console.log.init.png">


# Docs
[Tutorials](https://daocasino.readme.io/v2.0/docs/overview)

[More about DApps](https://github.com/DaoCasino/BankRollerApp/tree/master/DApps)

[[RU] Minimal Game](https://daocasino.readme.io/v2.0/docs/minimum-viable-game)


[[RU] Game with PayChannels](https://daocasino.readme.io/v2.1/docs/game-with-paychannels)


[DCLib References](https://ipfs.infura.io/ipfs/QmRYB24gqeuYHqFm2q48BmnFejL6P2mJtsjzvcjLB6MDm4)

