import React from 'react'
import Peer from 'peerjs'
import useLocalStorage from '/services/hooks/useLocalStorage.js'
import useEventCallback from '/services/hooks/useEventCallback.js'
import peerOptions from '/shared/peerOptions.js'

const { useEffect, useState, useRef } = React

export default () => {
  const [peerId, setPeerId] = useLocalStorage('peerId', undefined)
  const peer = useRef(new Peer(peerId, peerOptions))
  const textArea = useRef(null)
  const [connection, setConnection] = useState(null)
  const [connectionStatus, setConnectionStatus] = useState(null)
  const [text, setText] = useState(null)

  useEffect(() => {
    console.log(`connection status: ${connectionStatus}`)
  }, [connectionStatus])

  useEventCallback(peer && peer.current, 'open', setPeerId)
  useEventCallback(peer && peer.current, 'connection', setConnection)

  useEventCallback(connection, 'open', () => {
    setConnectionStatus('open')
  })

  useEventCallback(connection, 'data', (data) => {
    setText(data)
    textArea.current.innerText = data
  })

  useEventCallback(connection, 'error', (error) => {
    setConnectionStatus('error')
    console.log(error)
  })

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
