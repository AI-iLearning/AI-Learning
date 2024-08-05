import styled from 'styled-components'

export const MobileContainer = styled.div`
  max-width: 400px; // 개발용 화면 디자인 확인
  width: 100vw;
  margin-left: auto;
  margin-right: auto;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  height: calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom));
  padding-top: env(safe-area-inset-top);
  padding-right: env(safe-area-inset-right);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  overflow-y: auto;
`
