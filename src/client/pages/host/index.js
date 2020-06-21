import React from 'react'
import Peer from 'peerjs'
import useLocalStorage from '/services/hooks/useLocalStorage.js'
import peerOptions from '/shared/peerOptions.js'

const { useEffect, useState, useRef } = React

export default () => {
  const [peerId, setPeerId] = useLocalStorage('peerId', null)
  const peer = useRef(new Peer(peerId, peerOptions))
  const textArea = useRef(null)
  const [connection, setConnection] = useState(null)
  const [connectionStatus, setConnectionStatus] = useState(null)
  const [text, setText] = useState(null)

  useEffect(() => {
    console.log(`connection status: ${connectionStatus}`)
  }, [connectionStatus])

  useEffect(() => {
    peer.current.on('open', setPeerId)

    console.log(peer.current)
    peer.current.on('connection', c => {
      setConnection(c)
    })
  }, [peer])

  useEffect(() => { // set up connection callbacks
    if (connection) {
      connection.on('data', (data) => {
        setText(data)
        textArea.current.innerText = data
      });

      connection.on('open', () => {
        setConnectionStatus('open')
      });

      connection.on('error', (error) => {
        setConnectionStatus('error')
        console.log(error)
      });
    }
  }, [connection])

  useEffect(() => {
    if (connection) {
      connection.on('data', (data) => {
        setText(data)
      });
    }
  }, [connection])

  const handleTextSend = () => {
    if (connection && connectionStatus === 'open' && text) {
      connection.send(text)
    }
  }

  const handleTextAreaChange = e => {
    setText(e.target.value)
  }

  return <div>
    <h2>Host a Connection</h2>
    <code>{peerId}</code>
    <br />
    <textarea onChange={handleTextAreaChange} ref={textArea} />
    <button onClick={handleTextSend} disabled={connectionStatus !== 'open'}>Send Text</button>
    <p style={{color: 'red'}}>{text}</p>
  </div>
}
