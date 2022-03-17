/**
 * Stripe helper file
 *
 * @package   backend/src/helper
 * @author    Taras <streaming9663@gmail.com>
 * @copyright 2020 Say Digital Company
 * @license   Turing License
 * @version   2.0
 * @link      https://turing.ly/
 */

const dotenv = require('dotenv')
dotenv.config()

const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const stripeHelper = {
    createBankSource: createBankSource,
    createCardSource: createCardSource,
    createCustomer: createCustomer,
    attachSourceToCustomer: attachSourceToCustomer,
    createCharge: createCharge,
    sendStripeEmail: sendStripeEmail,
    updateCustomer: updateCustomer,
    deleteCardSource: deleteCardSource,
}

function createBankSource(iban, account_holder_name) {
    return new Promise((resolve, reject) => {
        stripe.sources.create({
            type: 'sepa_debit',
            sepa_debit: {iban: iban},
            currency: 'eur',
            owner: {
              name: account_holder_name,
            },
          }).then((source) => {
            resolve(source)
          }).catch((err) => {
              console.log('createBankSource error == ', err)
              reject(err)
          });
    });
}

function createCardSource(stripeCustomerId, cardToken) {
    return new Promise(async (resolve, reject) => {
        try {
            const source = await stripe.customers.createSource(stripeCustomerId,
                {
                  source: cardToken
                }
            );
            resolve(source);
        } catch (error) {
            reject(error);
        }
    });
}

function deleteCardSource(stripeCustomerId, cardToken) {
    return new Promise(async (resolve, reject) => {
        try {
            const deleted = await stripe.customers.deleteSource(
                stripeCustomerId,
                cardToken
              );
            resolve(deleted);
        } catch (error) {
            reject(error);
        }
    });
}

function createCustomer(data) {
    return new Promise((resolve, reject) => {
        stripe.customers.create(
            data
        ).then((customer) => {
            resolve(customer)
        }).catch((err) => {
            console.log('createCustomer error == ', err)
            reject(err)
        });
    });
}

function updateCustomer(customerID, data) {
    return new Promise((resolve, reject) => {
        stripe.customers.update(
            customerID, data
        ).then((customer) => {
            resolve(customer)
        }).catch((err) => {
            console.log('updateCustomer error == ', err)
            reject(err)
        });
    });
}

function attachSourceToCustomer(stripeCustomerId, stripeSourceId){
    return new Promise(async (resolve, reject) => {
        stripe.customers.createSource(
            stripeCustomerId,
            {
              source: stripeSourceId,
            }
          ).then((response) => {
              resolve(response)
          }).catch((err) => {
              console.log('attachSourceToCustomer error == ', err)
              reject(err)
          });
    });
}

function createCharge(amount, stripe_customerID, stripe_sourceID, description, currency = 'eur') {
    return new Promise(async (resolve, reject) => {
        try {
            const chargeResponse = await stripe.charges.create({
                amount: amount,
                currency: currency,
                customer: stripe_customerID,
                description: description,
                source: stripe_sourceID
            });
            resolve(chargeResponse);
        } catch (error) {
            reject(error);
        }
    });
}

function sendStripeEmail(amount, receipt_email, currency = 'usd') {
    return new Promise(async (resolve, reject) => {
        try {
            console.log(' in send stripe email')
            const paymentIntent = await stripe.paymentIntents.create({
                amount: amount,
                currency: currency,
                payment_method_types: ['card'],
                receipt_email: receipt_email
            });

            resolve(paymentIntent);
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = stripeHelper