const DEV_ADDRESS = '0xe88030c28d23d2120C687f49FB5cC2830F0Edb39';

const DEX_SCREENER = 'https://dexscreener.com/ethereum/'
const paths = {
  HOME: `/`
};
const addresses = {
  'feeSharingSystem': '0xBcD7254A1D759EFA08eC7c3291B2E85c5dCC12ce',
  'feeSetting': '0x5924a28caaf1cc016617874a2f0c3710d881f3c1',
  'distributor': '0x465a790b428268196865a3ae2648481ad7e0d3b1',
  'LOOKS': '0xf4d2888d29d722226fafa5d9b24f9164c092421e',
  'LOOKS-WETH': '0xdc00ba87cc2d99468f7f34bc04cbf72e111a32f7',
  'WETH': '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  'WETH-USDC': '0x397FF1542f962076d0BFE58eA045FfA2d347ACa0',
  'USDC': '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
};

const decimals = {
  'LOOKS': 18,
  'WETH': 18,
  'USDC': 6
};

const fiatCurrencyMap = {
  usd: {
    label: 'USD',
    address: ''
  },
  aud: {
    label: 'AUD',
    address: '0x77F9710E7d0A19669A13c055F62cd80d313dF022'
  },
  cad: {
    label: 'CAD',
    address: '0xa34317db73e77d453b1b8d04550c44d10e981c8e'
  },
  eur: {
    label: 'EUR',
    address: '0xb49f677943bc038e9857d61e7d053caa2c1734c1'
  },
  gbp: {
    label: 'GBP',
    address: '0x5c0ab2d9b5a7ed9f470386e82bb36a3613cdd4b5'
  },
  sgd: {
    label: 'SGD',
    address: '0xe25277ff4bbf9081c75ab0eb13b4a13a721f3e13'
  },
  inr: {
    label: 'INR',
    address: '0x605d5c2fbcedb217d7987fc0951b5753069bc360'
  },
  php: {
    label: 'PHP',
    address: '0x9481e7ad8be6bbb22a8b9f7b9fb7588d1df65df6'
  },
  brl: {
    label: 'BRL',
    address: '0x971e8f1b779a5f1c36e1cd7ef44ba1cc2f5eee0f'
  },
  jpy: {
    label: 'JPY',
    address: '0xbce206cae7f0ec07b545edde332a47c2f75bbeb3'
  },
  aed: {
    label: 'AED',
    address: ''
  },
  btc: {
    label: 'BTC',
    address: '0xf4030086522a5beea4988f8ca5b36dbc97bee88c'
  },
  eth: {
    label: 'ETH',
    address: '0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419'
  }
}

const network = {
  symbol: 'ETH',
  name: 'Ethereum',
  rpcURL: 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
  chartURL: 'https://dexscreener.com/ethereum/',
  blockRateSeconds: 13.14
};

export {
  network,
  paths,
  fiatCurrencyMap,
  addresses,
  decimals,
  DEV_ADDRESS,
  DEX_SCREENER
};
