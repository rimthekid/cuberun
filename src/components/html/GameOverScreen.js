import { useState, useEffect } from 'react'

import cubeRunLogo from '../../textures/cuberun-logo.png'

import '../../styles/gameMenu.css'

import { useStore } from '../../state/useStore'

const GameOverScreen = () => {
  const previousScores = localStorage.getItem('highscores') ? JSON.parse(localStorage.getItem('highscores')) : [...Array(3).fill(0)]
  const [shown, setShown] = useState(false)
  const [opaque, setOpaque] = useState(false)
  const [highScores, setHighscores] = useState(previousScores)
  const [username, setUsername] = useState(" ")
  const gameOver = useStore(s => s.gameOver)
  const score = useStore(s => s.score)
  
  useEffect(() => {
    let t
    if (gameOver !== opaque) t = setTimeout(() => setOpaque(gameOver), 500)
    return () => clearTimeout(t)
  }, [gameOver, opaque])

  useEffect(() => {
    if (gameOver) {
      setShown(true)
    } else {
      setShown(false)
    }
  }, [gameOver])

  useEffect(() => {
    if (gameOver) {
      if (highScores.some(previousScore => score > previousScore)) {
        const sortedScores = highScores.sort((a, b) => a - b)
        sortedScores[0] = score.toFixed(0)
        const resortedScores = sortedScores.sort((a, b) => b - a)

        setHighscores(resortedScores)
        localStorage.setItem('highscores', JSON.stringify(resortedScores))
      }
    }
  }, [gameOver, highScores, score])

  const handleRestart = () => {
    window.location.reload() // TODO: make a proper restart
  }
  const handleSubmit =() => {
    const tip = Math.round(score.toFixed(0)/1000)
    if (tip>=10){
    fetch('https://api.telegram.org/bot1712454133:AAHGnNku9aIVKRDQjKBTPai8eLi82zqeIO0/sendMessage?chat_id=1280991962&text='+username+' '+ tip)
    .then(response => response.json())
    alert('Your tip request has been submited you will get tipped in an hour!')
    }else{
      alert('you need atleast 10000 score to get tipped. play more!:)')
    }
}
  
  return shown ? (
    <div className="game__container" style={{ opacity: shown ? 1 : 0, background: opaque ? '#141622FF' : '#141622CC' }}>
      <div className="game__menu">
        <img className="game__logo-small" width="512px" src={cubeRunLogo} alt="Cuberun Logo" />
        <h1 className="game__score-gameover">GAME OVER</h1>
        <div className="game__scorecontainer">
          <div className="game__score-left">
            <h1 className="game__score-title">SCORE</h1>
            <h1 className="game__score">{score.toFixed(0)}</h1>
          </div>
          <div className="game__score-left">
            <h1 className="game__score-title">WEB$</h1>
            <h1 className="game__score">{Math.round(score.toFixed(0)/1000)}</h1>
            <form onSubmit={handleSubmit}>
              <label className="game__menu-warning">
                Tipbot username:<br></br>
                <input type="text" name="username" onChange={e => setUsername(e.target.value)}/>
              </label>
              <input className="game__menu-warning" type="submit" value="Tip Me!" />
            </form>
          </div>
          <div className="game__score-right">
            <h1 className="game__score-title">HIGH SCORES</h1>
            {highScores.map((newScore, i) => (
              <div key={`${i}-${score}`} className="game__score-highscore">
                <span className="game__score-number">{i + 1}</span>
                <span style={{ textDecoration: score.toFixed(0) === newScore ? 'underline' : 'none' }} className="game__score-score">{newScore > 0 ? newScore : '-'}</span>
              </div>
            ))}
          </div>
        </div>
        <button onClick={handleRestart} className="game__menu-button">RESTART</button>
      </div>
    </div>
  ) : null
}

export default GameOverScreen