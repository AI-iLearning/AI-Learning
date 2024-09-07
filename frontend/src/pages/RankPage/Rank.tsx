import { useNavigate } from 'react-router-dom'

const Rank = () => {
  const navigate = useNavigate()

  const handleComplete = () => {
    navigate('/test')
  }

  return (
    <>
      Rank Page
      <button onClick={handleComplete}>완료</button>
    </>
  )
}

export default Rank
