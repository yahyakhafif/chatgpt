import { useState, useEffect } from 'react'
import './App.css'

const App = () => {
  const [value, setValue] = useState('')
  const [message, setMessage] = useState(null)
  const [previousChats, setPreviousChats] = useState([])
  const [currentTitle, setCurrentTitle] = useState(null)

  const createNewChat = () => {
    setMessage(null)
    setValue("")
    setCurrentTitle(null)
  }

  const handleClick = (uniqueTitles) => {
    setCurrentTitle(uniqueTitles)
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
      const response = await fetch('http://localhost:8000/completions', options);
      const completion = await response.json();

      if (completion.choices && completion.choices.length > 0 && completion.choices[0].message) {
        setMessage(completion.choices[0].message.content);
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

  const currentChat = previousChats.filter(previousChats => previousChats.title == currentTitle)
  const uniqueTitles = Array.from(previousChats.map(previousChats => previousChats.title))



  return (
    <div className="app">
      <section className="side-bar">
        <button onClick={createNewChat}> + New Chat </button>
        <ul className="history">
          {uniqueTitles?.map((uniqueTitles, index) => <li key={index} onClick={handleClick}>{uniqueTitles}</li>)}
        </ul>
        <nav>
          <p>Made by Yahya</p>
        </nav>
      </section>
      <section className="main">
        {!currentTitle && <h1>YahyaGPT</h1>}
        <ul className="feed">
          {currentChat?.map((chatMessage, index) => <li key={index}>
            <p className='role'>{chatMessage.role}</p>
            <p>{chatMessage.content}</p>
          </li>)}
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
