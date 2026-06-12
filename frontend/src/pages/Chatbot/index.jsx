import {Component} from 'react'

import {apiRequest} from '../../services/api'

import './index.css'

class Chatbot extends Component {
  state = {
    question: '',
    messages: [],
    loading: false,
  }

  askQuestion = async () => {
    const {question, messages} = this.state

    if (!question.trim()) {
      return
    }

    const userMessage = {
      sender: 'user',
      text: question,
    }

    this.setState({
      messages: [...messages, userMessage],
      loading: true,
      question: '',
    })

    try {
      const data = await apiRequest(
        '/chatbot',
        {
          method: 'POST',
          body: JSON.stringify({
            question,
          }),
        },
      )

      const aiMessage = {
        sender: 'ai',
        text: data.answer,
      }

      this.setState(prevState => ({
        messages: [
          ...prevState.messages,
          aiMessage,
        ],
        loading: false,
      }))
    } catch (error) {
      console.error(error)

      this.setState(prevState => ({
        messages: [
          ...prevState.messages,
          {
            sender: 'ai',
            text: 'Something went wrong. Please try again.',
          },
        ],
        loading: false,
      }))
    }
  }

  onKeyDown = event => {
    if (
      event.key === 'Enter' &&
      !event.shiftKey
    ) {
      event.preventDefault()

      this.askQuestion()
    }
  }

  render() {
    const {
      question,
      messages,
      loading,
    } = this.state

    return (
      <div className="chatbot-page">
        <div className="chatbot-container">
          <div className="chatbot-header">
            <h1>
              AI Career Assistant 🤖
            </h1>

            <p>
              Ask about jobs, skills,
              career paths and resume
              improvements.
            </p>
          </div>

          <div className="chat-messages">
            {messages.length === 0 && (
              <div className="welcome-card">
                <h3>
                  Welcome 👋
                </h3>

                <p>
                  Try asking:
                </p>

                <ul>
                  <li>
                    What skills should I
                    learn?
                  </li>

                  <li>
                    Which jobs match my
                    profile?
                  </li>

                  <li>
                    How can I improve my
                    resume?
                  </li>

                  <li>
                    Give me a roadmap to
                    become a Full Stack
                    Developer.
                  </li>
                </ul>
              </div>
            )}

            {messages.map(
              (message, index) => (
                <div
                  key={index}
                  className={`message ${
                    message.sender ===
                    'user'
                      ? 'user-message'
                      : 'ai-message'
                  }`}
                >
                  <strong>
                    {message.sender ===
                    'user'
                      ? 'You'
                      : 'AI Assistant'}
                  </strong>

                  <p>{message.text}</p>
                </div>
              ),
            )}

            {loading && (
              <div className="message ai-message">
                <strong>
                  AI Assistant
                </strong>

                <p>Thinking...</p>
              </div>
            )}
          </div>

          <div className="chat-input-container">
            <textarea
              placeholder="Ask anything..."
              value={question}
              onChange={e =>
                this.setState({
                  question:
                    e.target.value,
                })
              }
              onKeyDown={
                this.onKeyDown
              }
            />

            <button
              type="button"
              onClick={
                this.askQuestion
              }
            >
              Send
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default Chatbot