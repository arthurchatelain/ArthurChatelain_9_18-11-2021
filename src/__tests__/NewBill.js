/**
 * @jest-environment jsdom
 */

 import { screen } from "@testing-library/dom"
 import NewBillUI from "../views/NewBillUI.js"
 import NewBill from "../containers/NewBill.js"
 import userEvent from '@testing-library/user-event'
 import { localStorageMock } from '../__mocks__/localStorage'
 import store from '../__mocks__/store'
 import { storeMock, storeMockError } from '../__mocks__/storeMock'

 describe("Given I am connected as an employee on the bill page", () => {
     test("Then a NewBill insatnce should be created", () => {
       const html = NewBillUI()
       document.body.innerHTML = html
       const onNavigate = jest.fn(() => true)
       let instanceOfNewBills = new NewBill({document, onNavigate, store, localstorage: localStorageMock})
       expect(instanceOfNewBills).toBeDefined()
     })
     describe('When i load a file', () => {
       test('if the extension is wrong then it should return an error', () => {
         let jestAlert = window.alert
         window.alert = jest.fn()
         document.body.innerHTML = NewBillUI()
         const onNavigate = jest.fn(() => true)
         let instanceOfNewBills = new NewBill({document, onNavigate, store, localStorage: localStorageMock})
         const handleChange = jest.fn(() => instanceOfNewBills.handleChangeFile)
         let input = screen.getByTestId('file')
         input.addEventListener('change', handleChange)
         let file = new File(['wrongExtension'], 'wrongExtension.mp4', {type: 'video/mp4'})
         userEvent.upload(input, file)
         expect(document.querySelector(`input[data-testid="file"]`).value).toBe("")
         expect(window.alert).toHaveBeenCalled()
         window.alert = jestAlert 
       })
       test('if the extension is good then it should not return an error', () => {
        document.body.innerHTML = NewBillUI()
        const onNavigate = jest.fn(() => true)
        let instanceOfNewBills = new NewBill({document, onNavigate, store: storeMock, localStorage: localStorageMock})
        const handleChange = jest.fn(() => instanceOfNewBills.handleChangeFile)
        let input = screen.getByTestId('file')
        input.addEventListener('change', handleChange)
        let file = new File(['goodExtension'], 'goodExtension.png', {type: 'image/png'})
        userEvent.upload(input, file)
        expect(input.files[0].name).toBe('goodExtension.png')
      })
      test('if the extension is good but the promise return an error we should see it', () => {
        document.body.innerHTML = NewBillUI()
        const onNavigate = jest.fn(() => true)
        let instanceOfNewBills = new NewBill({document, onNavigate, store: storeMockError, localStorage: localStorageMock})
        const handleChange = jest.fn(() => instanceOfNewBills.handleChangeFile)
        let input = screen.getByTestId('file')
        input.addEventListener('change', handleChange)
        let file = new File(['goodExtension'], 'goodExtension.png', {type: 'image/png'})
        userEvent.upload(input, file)
      })
    })
    describe('When i submit the form', () => {
      test('It should send a bill with the rights informations', () => {
        document.body.innerHTML = NewBillUI()
        const onNavigate = (pathname) => window.history.pushState({}, pathname, window.location.origin + pathname )
        const input = screen.getByTestId('form-new-bill')
        let instanceOfNewBills = new NewBill({document, onNavigate, store: storeMock, localStorage: localStorageMock})
        const handleSubmit = jest.fn(e => instanceOfNewBills.handleSubmit(e))
        instanceOfNewBills.updateBill = jest.fn()
        screen.getByTestId('amount').value = '500'
        input.addEventListener('click', handleSubmit)
        userEvent.click(input)
        expect(handleSubmit).toHaveBeenCalled()
        expect(instanceOfNewBills.updateBill.mock.calls[0][0].amount).toBe(parseInt('500'))
      })
    })    
 })

//  test d'intégration POST 

describe("Given I am a user connected as an Employye", () => {
  describe("When I submit a new Bill", () => {
    test("posting a bill should return the bill", async () => {
       const getSpy = jest.spyOn(storeMock, "post")
       const bill = await storeMock.post({amount: 500})
       expect(getSpy).toHaveBeenCalledTimes(1)
       expect(bill.amount).toBe(parseInt('500'))
    })
  })
})