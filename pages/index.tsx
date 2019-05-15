import { Component } from 'react'
import io from 'socket.io-client'
import fetch from 'isomorphic-fetch'
const { alias } = require('../now.json');
interface MessageField extends Message {
  field: string,
  messages: Message[],
}

interface Message {
  id?: number,
  value?: string,
}
class HomePage extends Component<MessageField, {}> {
  public socket: SocketIOClient.Socket = io(alias);
  // fetch old messages data from the server
  static async getInitialProps() {
    const response = await fetch(`${alias}/messages`)
    const messages = await response.json()
    return { messages }
  }

  // init state with the prefetched messages
  state = {
    field: '',
    messages: this.props.messages,
  }

  // connect to WS server and listen events
  componentDidMount() {
    this.socket.on('message', this.handleMessage)
  }

  // close socket connection
  componentWillUnmount() {
    this.socket.off('message', this.handleMessage)
    this.socket.close()
  }

  // add messages from server to the state
  handleMessage = (message: Message) => {
    this.setState(() => ({ messages: this.state.messages.concat(message) }))
  }

  handleChange = (event: any) => {
    this.setState({ field: event.target.value });
  }

  // send messages to server and add them to the state
  handleSubmit = (event: any) => {
    event.preventDefault()


    // create message object
    const message: Message = {
      id: (new Date()).getTime(),
      value: this.state.field,
    }

    // send object to WS server
    this.socket.emit('message', message)

    // add it to state and clean current input value
    this.setState((state: MessageField) => ({
      field: '',
      messages: state.messages.concat(message)
    }))
  }

  render() {
    return (
      <main>
        <div>
          <ul>
            {this.state.messages.map(message =>
              <li key={message.id}>{message.value}</li>
            )}
          </ul>
          <form onSubmit={this.handleSubmit}>
            <input
              onChange={this.handleChange}
              type="text"
              placeholder="Hello world!"
              value={this.state.field}
            />
            <button>Send</button>
          </form>
        </div>
      </main>
    )
  }
}

export default HomePage