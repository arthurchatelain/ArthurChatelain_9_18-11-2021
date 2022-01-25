export const storeMock = {
    bills: function() {
        return new class {
            constructor(){
                this.key = 'HHJKOHB'
            }
            file = {}
            create = async ({data, headers = {}}) => {
                this.file.data = data
                this.file.headers = headers
                return await {
                    fileUrl: 'url',
                    key: 'KEY'
                }
            }
        }
    }
}

export const storeMockError = {
    bills: function() {
        return new class {
            create = () => Promise.reject(new Error('Erreur 404'))
        }
    }
}