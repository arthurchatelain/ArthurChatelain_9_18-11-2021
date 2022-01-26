import { post } from "jquery"

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
            update = async ({data, selector}) => {
                return await {
                    data: data,
                    selector: selector
                }
            }
        }
    },
    post: function(bill) {
        console.log(bill)
        return bill
    }
}

export const storeMockError = {
    bills: function() {
        return new class {
            create = () => Promise.reject(new Error('Erreur 404'))
        }
    }
}