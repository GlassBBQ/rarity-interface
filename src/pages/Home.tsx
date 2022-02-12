import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useHistory } from 'react-router'
import ReactPaginate from 'react-paginate'
import queryString, { parse } from 'query-string'
import { Meta, Token } from '../types'
import config from '../rarityConfig'
import { useQuery } from '@apollo/client'
import { GET_META, GET_TOKENS } from '../queries'
//import useOpenSeaOrders from '../hooks/useOpenSeaOrders'
import { formatURL } from '../utils'
import { TraitContext } from '../components/TraitContext'
import { RarityModeContext } from '../components/RarityModeContext'
import Loader from '../components/Loader'
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/react/solid'
//import Bottleneck from 'bottleneck'
import './Home.css'
import { Switch } from '@headlessui/react'

const tokensPerPage = 15

function Home() {
  const history = useHistory()
  const { page: pageParam } = parse(history.location.search)

  const [page, setPage] = useState(pageParam ? Number(pageParam) - 1 : 0)

  useEffect(() => {
    history.push(`?${queryString.stringify({ page: page + 1 })}`)
  }, [page, history])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [page])

  const [search, setSearch] = useState('')

  useEffect(() => {
    if (search) setPage(0)
  }, [search])

  const { queryParams: traitQueryParams, tokenCount } = useContext(TraitContext)

  useEffect(() => {
    if (!tokenCount) return
    const numPages = Math.ceil(tokenCount / tokensPerPage)
    setPage(page => Math.min(numPages - 1, page))
  }, [tokenCount])
  

  const { toggle, normalized } = useContext(RarityModeContext)

  const { data: tokenData } = useQuery<{ tokens: Token[] }>(GET_TOKENS, {
    variables: {
      orderBy: normalized ? 'rarity_score_normalized' : 'rarity_score',
      first: tokensPerPage,
      skip: page * tokensPerPage,
      ...(search ? { id: Number(search) } : {}),
      ...(traitQueryParams && traitQueryParams.length > 0
        ? { traits: traitQueryParams }
        : {}),
    },
  })

  const { data: metadata } = useQuery<{ meta: Meta }>(GET_META)

  useQuery(GET_META)

  // const tokenIds = useMemo(
  //   () => (tokenData ? tokenData.tokens.map((token) => token.id) : undefined),
  //   [tokenData]
  // )
  //const orders = useOpenSeaOrders(tokenIds)

  const pageCount = useMemo(() => {
    if (search) return 1
    const numTokens = tokenCount ?? metadata?.meta.numTokens
    return numTokens ? Math.ceil(numTokens / tokensPerPage) : undefined
  }, [metadata, search, tokenCount])

  

  return (
    <main className="content flex flex-col items-center mx-4 md:mx-6 lg:mx-8 xl:mx-10">
      <div className="wrap w-full flex items-center">
      <div className="hidden lg:flex text-gray-700 mr-6 text-sm leading-tight my-3">
        Trait normalization
      </div>
      <Switch
        checked={normalized}
        onChange={() => toggle()}
        className={`${normalized ? 'bg-blue-400' : 'bg-gray-400'}
        hidden lg:flex my-3 mr-3 relative inline-flex flex-shrink-0 h-6 w-12 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
      >
        <span
          aria-hidden="true"
          className={`${normalized ? 'translate-x-6' : 'translate-x-0'}
            pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200`}
        />
      </Switch>
      

        <Search search={search} setSearch={setSearch} />
      </div>
      <TokenList
        tokens={tokenData?.tokens}
        meta={metadata?.meta}
        //orders={orders}
        page={page}
        setPage={setPage}
        pageCount={pageCount}
      />
    </main>
  )
}

export default Home

interface SearchProps {
  search: string
  setSearch: (s: string) => void
}

const Search: React.FC<SearchProps> = ({ search, setSearch }) => {
  return (
    <input
      type="text"
      className="rounded-lg focus:ring-purple-400 text-sm my-3 border-gray-400"
      placeholder="Search by id"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  )
}

interface TokenListProps {
  tokens: Token[] | undefined
  meta: Meta | undefined
  //orders: Record<number, OpenSeaOrder>
  page: number
  setPage: (page: number) => void
  pageCount?: number
}

//asd
const TokenList: React.FC<TokenListProps> = ({
  tokens,
  meta,
  //orders,
  page,
  setPage,
  pageCount,
}) => {
  if (!tokens || !meta)
    return (
      <div className="w-full mt-6 items-center justify-center">
        <Loader />
        <br />
        <h1 className="text-lg sm:text-xl ml-2 sm:ml-5" style={{marginLeft: 'auto', marginRight: 'auto', textAlign: 'center'}}>Loading... </h1>
      </div>
    )
  return (
    <div className="grid min-h-full sm:grid-cols-5 gap-6 content-start sm:gap-4 md:gap-4 lg:gap-6 xl:gap-8 mb-8">
      {tokens.map((token) => (
        <Card key={token.id} token={token} />
      ))}
      <Pagination
        className="md:col-span-5 flex items-center justify-center gap-3 text-gray-600 text-xl font-light"
        initialPage={page}
        setPage={setPage}
        pageCount={pageCount}
      />
    </div>
  )
}

interface PaginationProps {
  initialPage: number
  setPage: (page: number) => void
  pageCount?: number
  className?: string
}

const Pagination: React.FC<PaginationProps> = ({
  initialPage,
  setPage,
  pageCount,
  className,
}) => {
  if (!pageCount) return null
  return (
    <ReactPaginate
      pageCount={pageCount}
      pageRangeDisplayed={5}
      marginPagesDisplayed={2}
      initialPage={initialPage}
      previousLabel={
        <ChevronDoubleLeftIcon className="h-6 w-6 text-gray-500" />
      }
      nextLabel={<ChevronDoubleRightIcon className="h-6 w-6 text-gray-500" />}
      onPageChange={(page) => setPage(page.selected)}
      breakClassName=""
      breakLinkClassName="hover:cursor-pointer"
      containerClassName={`${className}`}
      pageClassName=""
      pageLinkClassName="hover:cursor-pointer"
      activeClassName="text-black font-normal"
      previousClassName=""
      nextClassName=""
      previousLinkClassName="hover:cursor-pointer"
      nextLinkClassName="hover:cursor-pointer"
      disabledClassName=""
    />
  )
}

interface CardProps {
  token: Token
}


const Card: React.FC<CardProps> = ({ token }) => {
  // const limiter = new Bottleneck({
  //   maxConcurrent: 1,
  //   minTime: 333
  // });

  const [imgloading, imgsetLoading] = useState(true);
  const history = useHistory()
  const { normalized } = useContext(RarityModeContext)
  const {
    name,
    rank,
    rank_normalized,
    id,
    image,
    image_data,
    background_color,
  } = token
  const src = config.listImageKey
    ? token[config.listImageKey]
    : image_data ?? formatURL(image ?? '')
    //const counter = useRef(0);
    const imageLoaded = () => {
        imgsetLoading(false);
    }


   
    function loadImage(URL: any, retries = 50) {
      var img = new Image();
      img.src = URL;
      img.onerror = () => {
        if (retries > 0){
          loadImage(URL, retries -1);
        } else {
          alert('image not found');
        }
      }
      return img.src;
      }
    
  return (
    <div className="">
      <div className="cardd">
      <div className="ml-2 text-xl lg:text-lg flex font-gray-700 whitespace-nowrap flex-wrap justify-between tracking-tight font-bold">
        #{normalized ? rank_normalized : rank}
      </div>
      <div
        className="flex rounded-md"
        style={{
          backgroundColor:
            config.tokenBackgroundColor ??
            '#' + background_color ??
            'transparent',
        }}
      >
        
        <button onClick={() => history.push(`/token?id=${token.id}`)}>
          <a href={`/token?id=${token.id}`}>
          <div style={{display: imgloading ? "block" : "none", alignItems: 'center'}}>
       <Loader />
    </div>
    <div className='mr-2 ml-2' style={{visibility: imgloading ? "hidden" : "visible", position: imgloading ? 'fixed' : 'inherit'}}>
        <img 
              className="rounded w-full mr-2 ml-2"
              src={src}
              alt={name ?? 'Token #' + id}
              style={{ width: '100%', height: '100%', marginLeft: 'auto', marginRight: 'auto'}}
          onLoad={imageLoaded}
          onError={({ currentTarget }) => {
            currentTarget.src=loadImage(src)
          }} />
          
    </div>
            {/* <img
              loading="lazy"
              className="rounded w-full"
              src={src}
              alt={name ?? 'Token #' + id}
              style={{ width: '100%', height: 'auto', display: 'none'}}
            /> */}
          </a>
        </button>
      </div>
      <div className="ml-2 text-xl lg:text-lg flex font-gray-700 whitespace-nowrap flex-wrap justify-between tracking-tight">
        {name}
      </div>
      </div>
    </div>
  )
}

// interface OrderProps {
//   order: OpenSeaOrder | undefined
// }

// const Order: React.FC<OrderProps> = ({ order }) => {
//   if (!order) return null
//   return (
//     <a
//       className="text-xl lg:text-base text-blue-700"
//       href={`https://opensea.io/assets/${config.contractAddress}/${order.asset.token_id}`}
//       rel="noreferrer"
//       target="_blank"
//     >
//       {order.base_price / 1e18} ETH
//     </a>
//   )
// }
