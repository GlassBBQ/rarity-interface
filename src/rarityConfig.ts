interface Config {
  tokenBackgroundColor?: string
  contractAddress: string
  headerText?: string
  headerTextStyle?: React.CSSProperties
  logoURL?: string
  logoStyle?: React.CSSProperties
  listImageKey?: 'image' | 'image_data'
  mainImageKey?: 'image' | 'image_data' | 'animation_url'
  links?: {
    website?: string
    twitter?: string
    discord?: string
    openSea?: string
    etherscan?: string
  }
}

const config: Config = {
  contractAddress: '0xE27934fB3683872e35b8d9E57c30978e1260c614',
  mainImageKey: 'image',
  headerText: 'Bunny Punk',
  logoURL: 'https://gateway.pinata.cloud/ipfs/QmVniKr22tvN7GHuYJ9LNGmRLJCVCwWW9BEYtcDpJTVm72',
  links: {
    website: 'https://www.bunnypunk.io/',
    twitter: 'https://twitter.com/Bunny_Punk_NFT',
  },
}

export default config
