const PAYAZA_BASE_URL = 'https://api.payaza.africa/live'
const PAYAZA_KEY = process.env.PAYAZA_SECRET_KEY

const payazaHeaders = {
  'Authorization': `Payaza ${PAYAZA_KEY}`,
  'X-TenantID': 'test',
  'X-ProductID': 'app',
  'Content-Type': 'application/json'
}

export async function createVirtualAccount(jobId, amount, customerEmail, customerName) {
  try {
    const firstName = (customerName || 'Client').split(' ')[0]
    const lastName = (customerName || 'Client User').split(' ')[1] || 'User'

    const res = await fetch(
      `${BASE}/merchant-collection/merchant/virtual_account/generate_virtual_account/`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({
          account_name: customerName || 'GigPay Client',
          account_type: 'Dynamic',
          bank_code: '1067',
          account_reference: jobId,
          customer_first_name: firstName,
          customer_last_name: lastName,
          customer_email: customerEmail || 'client@gigpay.app',
          customer_phone_number: '07000000000',
          transaction_description: 'GigPay escrow payment',
          transaction_amount: String(amount),
          expires_in_minutes: '480'
        })
      }
    )
    const data = await res.json()
    console.log('Virtual account:', JSON.stringify(data))
    return data
  } catch (err) {
    console.error('Virtual account error:', err)
    return null
  }
}

export async function getPayazaAccountReference(currency = 'NGN') {
  try {
    const response = await fetch(
      `${PAYAZA_BASE_URL}/payaza-account/api/v1/mainaccounts/merchant/enquiry/main`,
      {
        method: 'GET',
        headers: payazaHeaders
      }
    )
    const data = await response.json()
    if (data.status && data.data) {
      const account = data.data.find(acc => acc.currency === currency)
      return account ? account.payazaAccountReference : null
    }
    return null
  } catch (error) {
    console.error('Get account reference error:', error)
    return null
  }
}

export async function getAccountName(bankCode, accountNumber) {
  try {
    const response = await fetch(
      `${PAYAZA_BASE_URL}/payaza-account/api/v1/mainaccounts/merchant/provider/enquiry`,
      {
        method: 'POST',
        headers: payazaHeaders,
        body: JSON.stringify({
          service_payload: {
            currency: 'NGN',
            bank_code: bankCode,
            account_number: accountNumber
          }
        })
      }
    )
    const data = await response.json()
    return data.response_content?.account_name || null
  } catch (error) {
    console.error('Account name enquiry error:', error)
    return null
  }
}

export async function sendPayout(amount, bankCode, accountNumber, narration) {
  try {
    const accountRef = await getPayazaAccountReference('NGN')
    if (!accountRef) throw new Error('Could not get Payaza account reference')

    const accountName = await getAccountName(bankCode, accountNumber)
    if (!accountName) throw new Error('Could not get account name')

    const response = await fetch(
      `${PAYAZA_BASE_URL}/payout-receptor/payout`,
      {
        method: 'POST',
        headers: payazaHeaders,
        body: JSON.stringify({
          transaction_type: 'nuban',
          service_payload: {
            payout_amount: amount,
            transaction_pin: process.env.PAYAZA_TRANSACTION_PIN,
            account_reference: accountRef,
            currency: 'NGN',
            country: 'NGA',
            payout_beneficiaries: [
              {
                credit_amount: amount,
                account_number: accountNumber,
                account_name: accountName,
                bank_code: bankCode,
                narration: narration,
                transaction_reference: `PAYOUT_${Date.now()}`,
                sender: {
                  sender_name: 'GigPay',
                  sender_phone_number: '',
                  sender_address: ''
                }
              }
            ]
          }
        })
      }
    )
    const data = await response.json()
    console.log('Payout response:', JSON.stringify(data))
    return data
  } catch (error) {
    console.error('Payout error:', error)
    return null
  }
}