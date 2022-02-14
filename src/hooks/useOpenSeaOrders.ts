import { useEffect, useState } from 'react'
import config from '../rarityConfig'
import { OpenSeaOrder } from '../types'

const idsToQuery = (ids: number[]) =>
  ids.reduce((qs, id) => `${qs}&token_ids=${id}`, '')


const options = { method: 'GET', headers: { Accept: 'application/json' } }

export const getOpenSeaOrders = (tokenIds: number[]) =>
  // fetch(
  //   `https://api.opensea.io/wyvern/v1/orders?asset_contract_address=${
  //     config.contractAddress
  //   }&bundled=false&include_bundled=false&include_invalid=false${idsToQuery(
  //     tokenIds
  //   )}&side=1&limit=20&offset=0&order_by=created_date&order_direction=desc`,
  //   options
  // )
  fetch('https://ela.city/api/nftitems/getSingleItemDetails', {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(`{ "contractAddress": "0xe27934fb3683872e35b8d9e57c30978e1260c614", "tokenID": ${idsToQuery(tokenIds)} }`) // body data type must match "Content-Type" header
  })
    .then((response) => response.json())
    .then((data) => data.orders as OpenSeaOrder[])


const useOpenSeaOrders = (tokenIds: number[] | undefined) => {
  const [orders, setOrders] = useState<OpenSeaOrder[]>([])

  useEffect(() => {
    if (!tokenIds || tokenIds.length === 0) return
    getOpenSeaOrders(tokenIds)
      .then((data) =>
        data.filter((order) => order.payment_token_contract.symbol !== 'WETH')
      )
      .then(setOrders)
  }, [tokenIds])

  return orders.reduce(
    (result, order) => ({ ...result, [Number(order.asset.token_id)]: order }),
    {} as { [id: number]: OpenSeaOrder }
  )
}

export default useOpenSeaOrders

export const getOpenSeaOrder = (tokenId: number) => {
  return fetch(
    `https://api.opensea.io/wyvern/v1/orders?asset_contract_address=${config.contractAddress}&bundled=false&side=1&include_bundled=false&include_invalid=false&token_id=${tokenId}&limit=20&offset=0&order_by=created_date&order_direction=desc`,
    options
  )
    .then((response) => response.json())
    .then((data) => data.orders as OpenSeaOrder[])
    .then((orders) =>
      orders.filter((x) => x?.payment_token_contract.symbol !== 'WETH')
    )
    .then((orders) => (orders.length > 0 ? orders[0] : null))
}

export const useOpenSeaOrder = (tokenId: number | undefined | null) => {
  const [order, setOrder] = useState<OpenSeaOrder | undefined>(undefined)

  useEffect(() => {
    if (!tokenId) return
    getOpenSeaOrder(tokenId).then((order) => order && setOrder(order))
  }, [tokenId])

  return order
}
