import './App.css';
import { useState } from 'react';
import { InputGroup, FormControl, Button, Row, Col } from 'react-bootstrap';
import Web3 from "web3";


const web3 = new Web3(
  new Web3.providers.HttpProvider(
    "https://kovan.infura.io/v3/4835aacd00f14c729f65403918fe2367"
  )
);
const { toWei, numberToHex: toHex } = web3.utils;

function App() {

  const [field, setField] = useState({
    sendingAddress: '',
    receivingAddress: '',
    privateKey: '',
    amount: 0,
    checkBalanceInput: '',
    balance: 0
  })

  const handleInputChange = (event) => {
    setField({
      ...field,
      [event.target.name]: event.target.value
    })
  }

  const checkAddressValid = async (address) => {
    return await web3.utils.isAddress(address)
    
  }

  const sendETH = async () => {
    var isValidSending = checkAddressValid(field['sendingAddress']),
        isValidReceiving = checkAddressValid(field['receivingAddress'])

    if(isValidSending && isValidReceiving) {
      console.log('Sending!')
      const nonce = await web3.eth.getTransactionCount(field['sendingAddress'])

      const gasPrice = await web3.eth.getGasPrice()

      const signed = await web3.eth.accounts.signTransaction({
        to: field['sendingAddress'],
        from: field['receivingAddress'],
        value: web3.utils.toHex(field['amount']),
        gasPrice: '0x' + parseInt(gasPrice, 10).toString(16),
        gas: 21000,
        nonce: nonce
      }, field['privateKey'])
      
      web3.eth.sendSignedTransaction(signed.rawTransaction, (err, hash) => {
        if(!err) {
          console.log("Txn Sent and hash is " + JSON.stringify(hash));
        } else {
          console.log('Error: ', err)
        }
      })
    }
  }

  const getBalance = async () => {
    
    var isValid = await checkAddressValid(field['checkBalanceInput'])
    
    if(isValid) {
      var getBalance = await web3.eth.getBalance(field['checkBalanceInput'])
      console.log(getBalance)
      setField({
        ...field,
        balance: web3.utils.fromWei(getBalance, 'ether')
      })
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <div style={{width: '400px'}}>
          <InputGroup className="mb-3">
            <InputGroup.Text id="inputGroup-sizing-default"><img width="25px" height="25px" src="images/noun_send.svg" /></InputGroup.Text>
            <FormControl
              name="sendingAddress"
              onChange={handleInputChange}
              placeholder="Sending Address"
              aria-label="Sending Address"
            />
          </InputGroup>
          <InputGroup className="mb-3">
          <InputGroup.Text id="inputGroup-sizing-default"><img width="25px" height="25px" src="images/noun_receive.svg" /></InputGroup.Text>
            <FormControl
              name="receivingAddress"
              onChange={handleInputChange}
              placeholder="Receiving Address"
              aria-label="Receiving Address"
            />
          </InputGroup>
          <InputGroup className="mb-3">
          <InputGroup.Text id="inputGroup-sizing-default"><img width="25px" height="25px" src="images/noun_key.svg" /></InputGroup.Text>
            <FormControl
              name="privateKey"
              onChange={handleInputChange}
              placeholder="Private Key"
              aria-label="Private Key"
            />
          </InputGroup>
          <InputGroup className="mb-3">
          <InputGroup.Text id="inputGroup-sizing-default"><img width="25px" height="25px" src="images/noun_ethereum.svg" /></InputGroup.Text>
            <FormControl
              name="amount"
              onChange={handleInputChange}
              placeholder="Amount"
              aria-label="Amount"
            />
          </InputGroup>
          <Button onClick={sendETH} variant="primary" size="lg" className="mb-4" style={{float: 'right', width: '100%'}}>Send</Button>
          <div className="mb-3" style={{margin: '0px', padding: '0px', width: '100%'}}>
            <Row>
              <Col>ETH Balance:</Col>
              <Col style={{textAlign: 'left'}}>{field['balance']}</Col>
            </Row>
          </div>
          <InputGroup className="mb-3">
            <InputGroup.Text id="inputGroup-sizing-default"><img width="25px" height="25px" src="images/noun_ethereum.svg" /></InputGroup.Text>
            <FormControl
              name="checkBalanceInput"
              onChange={handleInputChange}
              placeholder="Sending Address"
              aria-label="Sending Address"
            />
          </InputGroup>
          <Button onClick={getBalance} variant="primary" size="lg" style={{float: 'right', width: '100%'}}>Check Balance</Button>
        </div>
        
      </header>
    </div>
  );
}

export default App;
