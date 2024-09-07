import { createBrowserRouter } from 'react-router-dom'

import App from './App'
import AISchedule1 from './pages/AISchedule1Page/AISchedule1'
import AISchedule2 from './pages/AISchedule2Page/AISchedule2'
import AISchedule3 from './pages/AISchedule3Page/AISchedule3'
import CalendarInput from './pages/CalendarInputPage/CalendarInput'
import CalendarCycle from './pages/CalendarInputPage/CalenderCycle'
import Calendar from './pages/CalendarPage/Calendar'
import Login from './pages/LoginPage/Login'
import Profile from './pages/ProfilePage/Profile'
import Rank from './pages/RankPage/Rank'
import Recommend from './pages/RecommendPage/Recommend'
import Register from './pages/RegisterPage/Register'
import Test from './pages/TestPage/Test'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '',
        element: <Login />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: 'calendar',
        element: <Calendar />,
      },
      {
        path: 'calendarInput',
        element: <CalendarInput />,
      },
      {
        path: 'calendarCycle',
        element: <CalendarCycle />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
      {
        path: 'recommend-place',
        element: <Recommend />,
      },
      {
        path: 'ranking-place',
        element: <Rank />,
      },
      {
        path: 'ai-schedule-step1',
        element: <AISchedule1 />,
      },
      {
        path: 'ai-schedule-step2',
        element: <AISchedule2 />,
      },
      {
        path: 'ai-schedule-step3',
        element: <AISchedule3 />,
      },
      {
        path: 'test',
        element: <Test />,
      },
    ],
  },
])

export default router
