import { useNavigate } from 'react-router-dom'

import { useMenuStore } from '../../stores/useBottomMenuStore'

const Test: React.FC = () => {
  const navigate = useNavigate()
  const currentMenu = useMenuStore(state => state.currentMenu)

  const handleComplete = () => {
    if (currentMenu) navigate(currentMenu)
    else navigate('/calendar')
  }

  return (
    <div>
      <h1>Test Page</h1>
      <button onClick={handleComplete}>완료</button>
    </div>
  )
}

export default Test
