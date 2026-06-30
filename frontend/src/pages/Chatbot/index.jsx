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

  handleSuggestionClick = (suggestionText) => {
    this.setState({ question: suggestionText }, () => {
      this.askQuestion()
    })
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
              Ask about jobs, skills, career roadmaps and resume improvements.
            </p>
          </div>

          <div className="chat-messages">
            {messages.length === 0 && (
              <div className="welcome-card">
                <h3>
                  Welcome 👋
                </h3>

                <p>
                  I am your AI Career Assistant. I can analyze your resume skills, suggest learning roadmaps, and match you with open jobs. Click on any of the options below to get started:
                </p>

                <div className="suggestion-pills">
                  <button
                    type="button"
                    className="suggestion-pill"
                    onClick={() => this.handleSuggestionClick('Which jobs match my profile?')}
                  >
                    🔍 Match My Profile
                  </button>
                  <button
                    type="button"
                    className="suggestion-pill"
                    onClick={() => this.handleSuggestionClick('What skills should I learn next?')}
                  >
                    🚀 Skills to Learn
                  </button>
                  <button
                    type="button"
                    className="suggestion-pill"
                    onClick={() => this.handleSuggestionClick('How can I improve my resume?')}
                  >
                    📄 Resume Feedback
                  </button>
                  <button
                    type="button"
                    className="suggestion-pill"
                    onClick={() => this.handleSuggestionClick('Give me a roadmap to become a Full Stack Developer.')}
                  >
                    🗺️ Career Roadmap
                  </button>
                </div>
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

                <div className="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
          </div>

          <div className="chat-input-container">
            <textarea
              placeholder="Ask anything about your career..."
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
              disabled={loading || !question.trim()}
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