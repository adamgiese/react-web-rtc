import React from 'react'
import Peer from 'peerjs'
import useLocalStorage from '/services/hooks/useLocalStorage.js'
import useEventCallback from '/services/hooks/useEventCallback.js'
import { useLocation } from 'react-router-dom';
import queryString from 'query-string'
import peerOptions from '/shared/peerOptions.js'

const { useEffect, useState, useRef } = React

export default () => {
  const params = queryString.parse(useLocation().search)
  const [peerId, setPeerId] = useLocalStorage('peerId', null)
  const peer = useRef(new Peer(peerId, peerOptions))
  const textArea = useRef(null)
  const [friendId, setFriendId] = useState(null)
  const [connection, setConnection] = useState(null)
  const [connectionStatus, setConnectionStatus] = useState(null)
  const input = useRef(null)
  const [text, setText] = useState(null)

  useEffect(() => {
    console.log(`connection status: ${connectionStatus}`)
  }, [connectionStatus])

  useEventCallback(peer && peer.current, 'open', setPeerId)

  useEventCallback(connection, 'open', () => {
    setConnectionStatus('open')
  })

  useEventCallback(connection, 'data', (data) => {
    setText(data)
    textArea.current.innerText = data
  })

  useEventCallback(connection, 'error', () => {
    setConnectionStatus('error')
    console.log(error)
  })

  const onSubmit = e => {
    const val = input.current.value
    e.preventDefault()
    setFriendId(val)
    setConnectionStatus('pending')
    setConnection(peer.current.connect(val))
  }

  const handleTextAreaChange = e => {
    setText(e.target.value)
  }

  const handleTextSend = () => {
    if (connection && connectionStatus === 'open' && text) {
      connection.send(text)
    }
  }

  return <div>
    { connectionStatus === 'open' ? null :
      <form onSubmit={onSubmit}>
        <code>{peerId}</code>
        <pre>
          Your ID: {peerId}
          Friend ID: {friendId}
        </pre>
        <br />
        <label>Peer ID: <input type='text' ref={input} value={params.id} /></label>
        <input
          type="submit"
          value="Connect"
          disabled={['open','pending'].includes(connectionStatus)}
        />
      </form>
    }

    <textarea onChange={handleTextAreaChange} ref={textArea} />
    <button onClick={handleTextSend} disabled={connectionStatus !== 'open'}>Send Text</button>
    <p style={{color: 'red'}}>{text}</p>
  </div>
}
