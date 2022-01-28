/**
 * @jest-environment jsdom
 */


import { screen } from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { formatDate } from "../app/format.js"
import Bills from '../containers/Bills.js'
import store from '../__mocks__/store'
import localStorage from '../__mocks__/localStorage'
import userEvent from '@testing-library/user-event'
import NewBillUI from '../views/NewBillUI'

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", () => {
      const html = BillsUI({ data: []})
      document.body.innerHTML = html
      //to-do write expect expression
    })
    test("Then bills should be ordered from earliest to latest", () => {
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const datesSorted = dates.sort((a, b) => a > b ? -1 : 1)
      dates.map(bill => bill.replaceAll('-', ''))
      datesSorted.map(bill => bill.replaceAll('-', ''))
      dates.map(bill => bill = formatDate(bill))
      datesSorted.map(bill => bill = formatDate(bill))
      expect(dates).toEqual(datesSorted)
    })
    test("then if page is loading", () => {
      const html = BillsUI({loading: true, data: []})
      document.body.innerHTML = html
      screen.getByText('Loading...')
    })
    test("then if page return error", () => {
      const html = BillsUI({error: true, data: []})
      document.body.innerHTML = html
      screen.getByText('Erreur')
    })
  })
})

// tests unitaires des éléments du container/Bills

describe('Given i am connected as an employye on the bills page', () => {
  test('if i create a bill class, i shouldnt have errors', () => {
    let html = BillsUI({data: bills})
    document.body.innerHTML = html
    const onNavigate = jest.fn(() => true)
    let instanceOfBills = new Bills({document, onNavigate, store, localStorage})
    expect(instanceOfBills).toBeDefined()
  })
  test('if i click on the new bill icon then i should be drive at this pathname ', () => {
    let html = BillsUI({data: bills})
    document.body.innerHTML = html
    const onNavigate = () => document.body.innerHTML = NewBillUI()
    let instanceOfBills = new Bills({document, onNavigate, store, localStorage})
    let button = screen.getByTestId('btn-new-bill')
    button.addEventListener('click', instanceOfBills.handleClickNewBill)
    userEvent.click(screen.getByTestId('btn-new-bill'))
    expect(screen.getByText('Envoyer une note de frais')).toBeTruthy()
  })
  test('if i click on an eye icon then it should open the FileModal', () => {
    let html = BillsUI({data: bills})
    document.body.innerHTML = html
    const onNavigate = () => document.body.innerHTML = NewBillUI()
    let instanceOfBills = new Bills({document, onNavigate, store, localStorage})
    let buttons = Array.from(screen.getAllByTestId('icon-eye'))
    $.fn.modal = jest.fn();
    instanceOfBills.handleClickIconEye = jest.fn(instanceOfBills.handleClickIconEye)
    buttons.forEach(e => e.addEventListener('click', instanceOfBills.handleClickIconEye(e)))
    userEvent.click(buttons[0])
    expect(screen.getByText('Justificatif')).toBeTruthy()
  })
})

// test d'intégration de la fonctionnalité GET

const errorHandler = async (errorCode) => {
  store.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur : " + errorCode))
      )
      const html = BillsUI({ error: `Erreur ${errorCode}`})
      document.body.innerHTML = html
      let regex = new RegExp(`Erreur ${errorCode}`)
      return await screen.getByText(regex)
}

describe("Given I am a user connected as Admin", () => {
  describe("When I navigate to Dashboard", () => {
    test("fetches bills from mock API GET", async () => {
       const getSpy = jest.spyOn(store, "get")
       const bills = await store.get()
       expect(getSpy).toHaveBeenCalledTimes(1)
       expect(bills.data.length).toBe(4)
    })
    test("fetches bills from an API and fails with 404 message error", async () => {
      const message = errorHandler('404')
      expect(message).toBeTruthy()
    })
    test("fetches bills from an API and fails with 500 message error", async () => {
      const message = errorHandler('500')
      expect(message).toBeTruthy()
    })
  })
})