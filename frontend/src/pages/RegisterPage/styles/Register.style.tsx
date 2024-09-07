import styled from 'styled-components'

export const Container = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  align-items: center;
  padding: 1.5rem;
`

export const Title = styled.h1`
  width: 100%;
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
  padding: 1rem;
  border-bottom: 1px solid #dcdcdc;
  margin-bottom: 1rem;
`

export const Form = styled.form`
  width: 100%;
  max-width: 400px;
`

export const InputWrapper = styled.div`
  width: 100%;
  position: relative;
  margin-bottom: 1.5rem;
`

export const Label = styled.p`
  margin-bottom: 0.7rem;
  margin-left: 0.25rem;
  font-size: 0.875rem;
`

export const Input = styled.input`
  width: 100%;
  max-width: 400px;
  padding: 1rem;
  background-color: #f9fafb;
  border: 1px solid #d1d5db;
  color: #1a202c;
  border-radius: 0.375rem;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  box-sizing: border-box;

  &:focus {
    outline: 1px solid #2563eb;
    border-color: #525fd4;
  }
`

export const Select = styled.select`
  width: 40%;
  max-width: 400px;
  padding: 1rem;
  background-color: #f9fafb;
  border: 1px solid #d1d5db;
  color: #1a202c;
  border-radius: 0.375rem;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  box-sizing: border-box;

  &:focus {
    outline: 1px solid #2563eb;
    border-color: #525fd4;
  }
`

export const Button = styled.button`
  position: absolute;
  right: 0.75rem;
  top: 2.3rem;
  width: auto;
  background-color: #525fd4;
  color: white;
  font-size: 0.7rem;
  font-weight: normal;
  border: none;
  border-radius: 0.375rem;
  padding: 0.35rem 0.7rem;
  cursor: pointer;
  &:hover {
    background-color: #434cb1;
  }
`

interface ValidationMessageProps {
  error?: boolean
}

export const ValidationMessage = styled.p<ValidationMessageProps>`
  margin-left: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: ${props => (props.error ? '#f56565' : '#6b7280')};
`

export const SubmitButton = styled.button`
  width: 100%;
  max-width: 400px;
  height: 46px;
  border-radius: 8px;
  border: none;
  font-size: 16px;
  color: white;
  font-weight: 600;
  background-color: #525fd4;
  cursor: pointer;
  position: relative;
  &:hover {
    background-color: #434cb1;
  }
`

export const TextCenter = styled.p`
  margin-top: 2.5rem;
  text-align: center;
  font-size: 0.875rem;
  color: #6b7280;
`
export const Link = styled.a`
  font-weight: 600;
  color: #2563eb;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`

export const ModalOverlay = styled.div`
  position: fixed;
  top: 20px;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(107, 114, 128, 0.75);
`

export const ModalWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  inset: 0;
  z-index: 50;
  opacity: 1;
`

export const ModalContent = styled.div`
  background-color: white;
  border-radius: 0.375rem;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export const ModalBody = styled.div`
  text-align: center;
  padding: 2.5rem;
`

export const ModalIcon = styled.div`
  margin: auto;
  margin-bottom: 1rem;
  height: 3.5rem;
  width: 3.5rem;
  color: #4b5563;
`

export const ModalText = styled.h3`
  margin-bottom: 1.25rem;
  font-size: 1.125rem;
  font-weight: 400;
  color: #6b7280;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`

export const ModalButton = styled.button`
  background-color: #e5e7eb;
  color: black;
  width: 5rem;
  padding: 0.5rem;
  border-radius: 0.375rem;
  cursor: pointer;
  &:hover {
    background-color: #2563eb;
    color: white;
  }
`
