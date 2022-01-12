import {cacheServiceInstance} from './cacheService';
import { ethers } from 'ethers';

class CacheEthersService {
    /**
   *
   *
   * @param {String} rpcURL
   * @return {JsonRpcProvider}
   */
     provider(rpcURL) {
      const key = `Provider/${rpcURL}`;
      if (cacheServiceInstance.has(key)) {
        return cacheServiceInstance.get(key);
      }
      const provider = new ethers.providers.JsonRpcProvider(rpcURL);
      cacheServiceInstance.set(key, provider);
      return provider;
    }

    /**
     *
     *
     * @param {String} rpcURL
     * @param {Boolean} [clearCache=false]
     * @return {Object}
     */
    async blockNumber(rpcURL, clearCache=false) {
      const key = `ProviderBlock/${rpcURL}`;
      if (cacheServiceInstance.has(key) && !clearCache && !cacheServiceInstance.isExpired(key, 600)) {
        return cacheServiceInstance.get(key);
      }
      const provider = this.provider(rpcURL);
      const response = await provider.getBlockNumber();
      cacheServiceInstance.set(key, response);
      return response;
    }

    /**
     *
     *
     * @param {String} address
     * @param {String} abi
     * @return {Contract}
     */
    contract(address, abi, rpcURL) {
      const key = `Contract/${rpcURL}/${address}`;
      const provider = this.provider(rpcURL);
      if (cacheServiceInstance.has(key)) {
        return cacheServiceInstance.get(key);
      }
      const contract = new ethers.Contract(address, abi, provider);
      cacheServiceInstance.set(key, contract);
      return contract;
    }

    /**
     *
     *
     * @param {Contract} contract
     * @param {String} method
     * @param {Array} [params=[]]
     * @param {Boolean} [clearCache=false]
     * @return {mixed}
     */
    async contractCall(contract, method, params=[], clearCache=false) {
      const rpcURL = contract.provider?.connection?.url || 'null';
      const contractCallKey = `Contract/${contract.address}/${rpcURL}/${method}/${JSON.stringify(params)}`;
      if (cacheServiceInstance.has(contractCallKey) && !clearCache && !cacheServiceInstance.isExpired(contractCallKey, 600)) {
        return cacheServiceInstance.get(contractCallKey);
      }
      const response = await contract[method](...params);
      cacheServiceInstance.set(contractCallKey, response);

      return response;
    }
}
const cacheEthers = new CacheEthersService();

export {
  cacheEthers
}
