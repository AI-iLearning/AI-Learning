class AuthToken {
  private accessToken: string
  private readonly ACCESS_KEY: string = 'authToken' // access token 값

  constructor() {
    this.accessToken = localStorage.getItem(this.ACCESS_KEY) ?? ''
  }

  setAccessToken(newToken: string) {
    try {
      const stringifiedData = JSON.stringify(newToken)
      localStorage.setItem(this.ACCESS_KEY, stringifiedData)
      this.accessToken = newToken
    } catch (e) {
      this.accessToken = ''
    }
  }

  getAccessToken() {
    try {
      const res = localStorage.getItem(this.ACCESS_KEY)
      if (!res) {
        return this.accessToken
      }
      this.accessToken = JSON.parse(res)
      return this.accessToken
    } catch (e) {
      return this.accessToken
    }
  }

  removeAccessToken() {
    localStorage.removeItem(this.ACCESS_KEY)
    this.accessToken = ''
  }
}

const authToken = new AuthToken()

export default authToken
