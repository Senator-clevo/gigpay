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
    const firstName = customerName?.split(' ')[0] || 'Client'
    const lastName = customerName?.split(' ')[1] || 'User'

    const response = await fetch(
      `${PAYAZA_BASE_URL}/payaza-account/api/v1/onboarding/dynamicvirtualaccount`,
      {
        method: 'POST',
        headers: payazaHeaders,
        body: JSON.stringify({
          account_reference: jobId,
          amount: amount,
          currency_code: 'NGN',
          customer_email: customerEmail || 'client@gigpay.app',
          customer_first_name: firstName,
          customer_last_name: lastName,
          transaction_description: `GigPay escrow for job ${jobId}`
        })
      }
    )
    const data = await response.json()
    console.log('Virtual account response:', JSON.stringify(data))
    return data
  } catch (error) {
    console.error('Virtual account error:', error)
    return null
  }
}

export async function sendPayout(amount, bankCode, accountNumber, narration) {
  try {
    const response = await fetch(
      `${PAYAZA_BASE_URL}/subsidiary/transfers/v1/initiate-transfer`,
      {
        method: 'POST',
        headers: payazaHeaders,
        body: JSON.stringify({
          amount: amount,
          transaction_pin: process.env.PAYAZA_TRANSACTION_PIN,
          receiver: {
            account_number: accountNumber,
            bank_code: bankCode,
            account_name: narration,
            bank_name: '',
            currency_code: 'NGN'
          },
          transaction_reference: `PAYOUT_${Date.now()}`,
          transaction_description: narration,
          currency_code: 'NGN',
          country_code: 'NG'
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