import { useState, useEffect } from 'react'
import './App.css'
import chatgpt from './assets/chatgptLogo.svg'
import user from './assets/user-icon.png'
import logo from './assets/chatgpt.svg'

const App = () => {
  const [value, setValue] = useState(null)
  const [message, setMessage] = useState(null)
  const [previousChats, setPreviousChats] = useState([])
  const [currentTitle, setCurrentTitle] = useState(null)

  const createNewChat = () => {
    setMessage(null)
    setValue("")
    setCurrentTitle(null)
  }

  const handleClick = (uniqueTitle) => {
    setCurrentTitle(uniqueTitle)
    setMessage(null)
    setValue("")
  }

  const getMessages = async () => {
    const options = {
      method: "POST",
      body: JSON.stringify({
        message: value
      }),
      headers: {
        "Content-Type": "application/json"
      }
    }

    try {
      const response = await fetch('https://chatgpt-server-murex.vercel.app/', options);
      const completion = await response.json();

      if (completion.choices && completion.choices.length > 0 && completion.choices[0].message) {
        setMessage(completion.choices[0].message);
      } else {
        console.error("Unexpected response structure from OpenAI API:", completion);
      }
    } catch (error) {
      console.error(error);
    }
  }


  useEffect(() => {
    console.log(currentTitle, value, message)
    if (!currentTitle && value && message) {
      setCurrentTitle(value)
    }
    if (currentTitle && value && message) {
      setPreviousChats(prevChats => (
        [...prevChats,
        {
          title: currentTitle,
          role: "user",
          content: value
        },
        {
          title: currentTitle,
          role: message.role,
          content: message.content
        }
        ]
      ))
    }
  }, [message, currentTitle])

  const currentChat = previousChats.filter(previousChat => previousChat.title == currentTitle)
  const uniqueTitles = Array.from(new Set(previousChats.map(previousChat => previousChat.title)))



  return (
    <div className="app">
      <section className="side-bar">
        <button onClick={createNewChat}> + New Chat </button>
        <ul className="history">
          {uniqueTitles?.map((uniqueTitle, index) => <li key={index} onClick={() => handleClick(uniqueTitle)}>{uniqueTitle}</li>)}
        </ul>
        <nav>
          <p>Made by Yahya</p>
        </nav>
      </section>
      <section className="main">
        {!currentTitle && <h1><img src={logo} />YahyaGPT</h1>}
        <ul className="feed">
          {currentChat.map((chatMessage, index) => (
            <li key={index}>
              <p className="icons">
                {chatMessage.role === "user" ? (
                  <img src={user} alt='User Logo' />
                ) : (
                  <img src={chatgpt} alt='ChatGPT Logo' />
                )}
              </p>
              <p>{chatMessage.content}</p>
            </li>
          ))}
        </ul>
        <div className="bottom-section">
          <div className="input-container">
            <input value={value} onChange={(e) => setValue(e.target.value)} />
            <div id="submit" onClick={getMessages}>➤</div>
          </div>
          <p className="info">
            ChatGPT can make mistakes. Consider checking important information.
          </p>
        </div>
      </section>
    </div>
  );
}

export default App;
