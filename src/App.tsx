import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  WagmiProvider,
  useAccount,
  useConnect,
  useConnectors,
  useDisconnect,
  useReadContract,
} from 'wagmi'
import './App.css'
import { config } from './config'
import { AllowUSDT } from './AllowUSDT'

const client = new QueryClient()

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={client}>
        <div className="app">
          <div className="card">

            <h1>USDT Wallet</h1>

            <p className="subtitle">
              Connect your wallet and interact with USDT
            </p>

            <ConnectWallet />

            <div className="divider" />

            <TotalSupply />

            <Account />

            <div className="divider" />

            <AllowUSDT />

          </div>
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

function ConnectWallet() {
  const { address } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()
  const connectors = useConnectors()

  if (address) {
    return (
      <div className="wallet-section">
        <button
          className="disconnect-button"
          onClick={() => disconnect()}
        >
          Disconnect Wallet
        </button>
      </div>
    )
  }

  return (
    <div className="wallet-section">
      <h3>Connect your wallet</h3>

      <div className="connect-buttons">
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            className="connect-button"
            onClick={() => connect({ connector })}
          >
            Connect via {connector.name}
          </button>
        ))}
      </div>
    </div>
  )
}

function Account() {
  const { address } = useAccount()

  return (
    <div className="account">
      {address ? (
        <>
          <span className="status-dot" />
          <span>You are connected</span>
          <span className="address">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
        </>
      ) : (
        <>
          <span className="status-dot disconnected" />
          <span>You are not connected</span>
        </>
      )}
    </div>
  )
}

function TotalSupply() {
  const { data, isLoading, error } = useReadContract({
    address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    abi: [
      {
        constant: true,
        inputs: [],
        name: 'totalSupply',
        outputs: [
          {
            name: '',
            type: 'uint256',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
    ],
    functionName: 'totalSupply',
  })

  return (
    <div className="supply-box">
      <p>Total USDT Supply</p>

      {isLoading ? (
        <h2>Loading...</h2>
      ) : error ? (
        <h2>Unable to load</h2>
      ) : (
        <h2>{data?.toString()}</h2>
      )}
    </div>
  )
}

export default App