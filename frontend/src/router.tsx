import { createBrowserRouter } from 'react-router-dom'

import App from './App'
import IndoorAlertPopUp from './components/AlertPopUp/IndoorAlertPopUp/IndoorAlertPopUp'
import AISchedule1 from './pages/AISchedule1Page/AISchedule1'
import AISchedule2 from './pages/AISchedule2Page/AISchedule2'
import AISchedule3 from './pages/AISchedule3Page/AISchedule3'
import Alert from './pages/AlertPage/Alert'
import CalendarInput from './pages/CalendarInputPage/CalendarInput'
import CalendarCycle from './pages/CalendarInputPage/CalenderCycle'
import Calendar from './pages/CalendarPage/Calendar'
import AddPlace from './pages/CalendarPage/components/AddPlace'
import ChangeInfo from './pages/ChangeInfoPage/ChangeInfo'
import ChangeNickname from './pages/ChangeNicknamePage/ChangeNickname'
import ChangePassword from './pages/ChangePasswordPage/ChangePassword'
import CheckPassword from './pages/CheckPasswordPage/CheckPassword'
import DateSelected from './pages/DateSelectedPage/DateSelected'
import ChatRoom from './pages/GuidePage/components/ChatRoom'
import Guide from './pages/GuidePage/Guide'
import IndoorPlace from './pages/IndoorPlacePage/IndoorPlace'
import KakaoRedirectHandle from './pages/LoginPage/components/KakaoRedirectHandle'
import Login from './pages/LoginPage/Login'
import Start from './pages/LoginPage/Start'
import MyInfoEdit from './pages/MyInfoEditPage/MyInfoEdit'
import NotFound from './pages/NotFoundPage/NotFound'
import PasswordChange1 from './pages/PasswordChangePage/PasswordChange1'
import PasswordChange3 from './pages/PasswordChangePage/PasswordChange3'
import PlaceDetail from './pages/PlaceDetailPage/PlaceDetail'
import EachLevel from './pages/ProfilePage/components/EachLevel'
import Pattern from './pages/ProfilePage/components/Pattern'
import Profile from './pages/ProfilePage/Profile'
import Rank from './pages/RankPage/Rank'
import Recommend from './pages/RecommendPage/Recommend'
import RecommendDetail from './pages/RecommendPage/RecommendDetail'
import Register from './pages/RegisterPage/Register'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        path: '',
        element: <Start />,
      },
      {
        path: 'start',
        element: <Start />,
      },
      {
        path: 'login',
        element: <Login />,
      },

      {
        path: 'start/oauth',
        element: <KakaoRedirectHandle />,
      },
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: 'password-change1',
        element: <PasswordChange1 />,
      },
      {
        path: 'password-change3',
        element: <PasswordChange3 />,
      },
      {
        path: 'calendar',
        element: <Calendar />,
      },
      {
        path: 'indoorAlertPopUp',
        element: <IndoorAlertPopUp onClose={() => {}} />,
      },
      {
        path: 'addplace/:date',
        element: <AddPlace />,
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
        path: 'place/:contenttypeid/:contentid',
        element: <PlaceDetail />,
      },
      {
        path: 'indoorplace/:date/:contentid',
        element: <IndoorPlace />,
      },
      {
        path: 'guide',
        element: <Guide />,
      },
      {
        path: 'chat/:guideId/:name',
        element: <ChatRoom />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
      {
        path: 'pattern',
        element: <Pattern />,
      },
      {
        path: 'alert',
        element: <Alert />,
      },
      {
        path: 'eachlevel/:level',
        element: <EachLevel />,
      },
      {
        path: 'recommend-place',
        element: <Recommend />,
      },
      {
        path: 'recommend-place-detail',
        element: <RecommendDetail />,
      },
      {
        path: 'dateselected/:contentid/:place',
        element: <DateSelected />,
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
        path: 'my-info',
        element: <MyInfoEdit />,
      },
      {
        path: 'change-nickname',
        element: <ChangeNickname />,
      },
      {
        path: 'check-password',
        element: <CheckPassword />,
      },
      {
        path: 'change-password',
        element: <ChangePassword />,
      },
      {
        path: 'change-info',
        element: <ChangeInfo />,
      },
    ],
  },
])

export default router
