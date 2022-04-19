import { useState, useEffect } from 'react';
import './App.css';
import { BsArrowRight } from "react-icons/bs";
import { BiSend } from "react-icons/bi";
import { abi, CONTRACT_ADDRESS } from "./constants";

import { ethers } from "ethers";



function App() {
  const [ address, setAddress] = useState("0x000000000000000000")
  const [ addressTo, setAddressTo] = useState(" ")
  const [ amount, setAmount] = useState(" ")
  const [ message, setMessage] = useState(" ")
  // const [ balance, setBalance] = useState("24")
  const [ history, setHistory] = useState(false)
  const [ loading, setLoading] = useState(false)
  const [ connected, setConnected] = useState(false)
  // const [ provider, setProvder] = useState("")
  const [ ethBalance, setEthBalance] = useState(0)
  // const [ contract, setContract] = useState({})
  

  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const contracts = new ethers.Contract(CONTRACT_ADDRESS, abi, provider)

 
  useEffect(()=>{
    
  }, [])

  const connectWallet = async()=>{
    try {
      
      
      
      
      const account = await provider.send("eth_requestAccounts", [0]);
      
      const balance = await provider.getBalance(account[0]);
      
      setConnected(true)
      setEthBalance(ethers.utils.formatEther(balance))

      setAddress(account)
      
      // const aboutContract = new ethers.Contract(NFT_CONTRACT_ADDRESS, abi, provider)

      // setContract(aboutContract);

      // console.log(aboutContract)


      
      
    } catch (error) {
      // throw error ("connect to metamask")
    }

  }

  console.log(contracts)
  

  const transfer = async()=>{
    const signer = provider.getSigner()
    const contracts = new ethers.Contract(CONTRACT_ADDRESS, abi, signer)
    contracts.transferFun(addressTo, )
    // console.log(contracts.transferFun)
  }
  transfer()


  const getAllTransactions = async()=>{
    
    const contracts = new ethers.Contract(CONTRACT_ADDRESS, abi, provider)
    console.log(contracts.getAllTransactions)
  }

  getAllTransactions()
  return (
    <div className="App">
      <div className="container-content">

        {!connected? <button onClick={connectWallet}>Connect wallet</button> : ""}
        

        {connected && (<div className="wallet__details">
          <div className="send__transaction">
            <input type="text" placeholder='Address' onChange={(e)=>{ setAddressTo(e.target.value)}}/>
            <input type="number" placeholder='Amount' onChange={(e)=>{ setAmount(e.target.value)}} />
            <h3>{amount}</h3>
            <input type="text" placeholder='message' onChange={(e)=>{ setMessage(e.target.value)}}/>
            <button>Send <BiSend /></button>

          </div>
          <div className="card">
            <div className="card__showcase">
              <h4>{address}</h4>
              <p>{ethBalance}ETH</p>
            </div>
            <p className="transaction__history-btn" onClick={()=>{setHistory(!history)}}>Transaction history</p>
          </div>
        </div>)}
      </div>

      { connected && history && (<div className="transaction__history ">
        <div className="close"> <BsArrowRight  className='close__icon' onClick={()=>{setHistory(false)}} /></div>
        <div className="transaction__header">
          <h2>Transaction history</h2>
        </div>
          <div className="transaction__history-contents">
            <div className="transaction__history-data">
              <h3>To: 0xxxxxssxx</h3>
              <p>Amount:</p>
              <p>Message:</p>
              <hr />
            </div>
            <div className="transaction__history-data">
              <h3>To: 0xxxxxssxx</h3>
              <p>Amount:</p>
              <p>Message:</p>
              <hr />
            </div>
            <div className="transaction__history-data">
              <h3>To: 0xxxxxssxx</h3>
              <p>Amount:</p>
              <p>Message:</p>
            </div>
          </div>
      </div>)}
    </div>
  );
}

export default App;
