const fs = require('fs');
const Web3 = require('web3');

const addresses = JSON.parse(fs.readFileSync('./addresses.json', 'utf8'));
const abis = JSON.parse(fs.readFileSync('./abi.json', 'utf8'));

const BlockchainNetworks = [
  /* "mainnet",
  "mainnetsidechain", */
  "polygon",
  /* "testnet",
  "testnetsidechain",
  "testnetpolygon", */
];

async function initNftCache({chainName}) {
  // const webSocketWeb3 = web3sockets[chainName];
  // const contract = wsContracts[chainName];
  
  const polygonVigilKey = `1bdde9289621d9d420488a9804254f4a958e128b`;
  const web3socket = new Web3(new Web3.providers.WebsocketProvider(`wss://rpc-mainnet.maticvigil.com/ws/v1/${polygonVigilKey}`));
  
  const wsContracts = {};
  BlockchainNetworks.forEach(network => {
    wsContracts[network] = {
      Account: new web3socket.eth.Contract(abis.Account, addresses[network].Account),
      FT: new web3socket.eth.Contract(abis.FT, addresses[network].FT),
      FTProxy: new web3socket.eth.Contract(abis.FTProxy, addresses[network].FTProxy),
      NFT: new web3socket.eth.Contract(abis.NFT, addresses[network].NFT),
      NFTProxy: new web3socket.eth.Contract(abis.NFTProxy, addresses[network].NFTProxy),
      Trade: new web3socket.eth.Contract(abis.Trade, addresses[network].Trade),
      LAND: new web3socket.eth.Contract(abis.LAND, addresses[network].LAND),
      LANDProxy: new web3socket.eth.Contract(abis.LANDProxy, addresses[network].LANDProxy),
    }
  });
    
  async function getPastEvents({
    chainName = 'polygon',
    contractName = 'NFTProxy',
    eventName = 'Deposited',
    fromBlock = 12949774, // change to 12950775 and it will hang
    toBlock =   12950775,
  } = {}) {
    try {
      return await wsContracts[chainName][contractName].getPastEvents(
        eventName,
        {
          fromBlock,
          toBlock,
        }
      );
    } catch(e) {
      console.error(e);
      return [];
    }
  }
  console.log('wait 1');
  const r = await getPastEvents();
  console.log('wait 2', r);
}
initNftCache({chainName: 'polygon'});