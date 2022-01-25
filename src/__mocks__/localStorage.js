export const localStorageMock = {
  store: {
    user: {
      email: "chatelain@gmail.com"
    }
  },
  getItem: function(key) {
    return JSON.stringify(this.store[key])
  },
  setItem: function(key, value) {
    this.store[key] = value.toString()
  },
  clear: function() {
    this.store = {}
  },
  removeItem: function(key) {
    delete this.store[key]
  }
}