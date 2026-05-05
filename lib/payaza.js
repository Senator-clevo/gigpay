const PAYAZA_BASE_URL = 'https://api.payaza.africa/live'
const PAYAZA_KEY = process.env.PAYAZA_SECRET_KEY

const payazaHeaders = {
  'Authorization': `Payaza ${PAYAZA_KEY}`,
  'X-TenantID': 'test',
  'X-ProductID': 'app',
  'Content-Type': 'application/json'
}

// 1. Create a virtual account for a job (escrow)
export async function createVirtualAccount(jobId, amount, customerEmail, customerName) {
  const response = await fetch(
    `${PAYAZA_BASE_URL}/payaza-account/api/v1/onboarding/dynamicvirtualaccount`,
    {
      method: 'POST',
      headers: payazaHeaders,
      body: JSON.stringify({
        account_reference: jobId,
        amount: amount,
        currency_code: 'NGN',
        customer_email: customerEmail,
        customer_first_name: customerName.split(' ')[0],
        customer_last_name: customerName.split(' ')[1] || 'Client',
        transaction_description: `Payment for job ${jobId}`
      })
    }
  )
  return response.json()
}

// 2. Check virtual account payment status
export async function checkVirtualAccountStatus(accountReference) {
  const response = await fetch(
    `${PAYAZA_BASE_URL}/payaza-account/api/v1/onboarding/virtualaccountstatus/${accountReference}`,
    {
      method: 'GET',
      headers: payazaHeaders
    }
  )
  return response.json()
}

// 3. Transfer money to worker's bank account (payout)
export async function sendPayout(amount, bankCode, accountNumber, narration) {
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
  return response.json()
}

// 4. Verify a transfer status
export async function checkTransferStatus(transactionReference) {
  const response = await fetch(
    `${PAYAZA_BASE_URL}/subsidiary/transfers/v1/transaction-status/${transactionReference}`,
    {
      method: 'GET',
      headers: payazaHeaders
    }
  )
  return response.json()
}