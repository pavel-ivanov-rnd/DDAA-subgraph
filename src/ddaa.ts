import { BigInt, log } from "@graphprotocol/graph-ts"
import {
  DDAA as DDAA_contract,
  orderSubmitted,
  paymentToAnnotator
} from "../generated/DDAA/DDAA"
import { Customer, Order, Verifier, Annotator } from "../generated/schema"

export function handleorderSubmitted(event: orderSubmitted): void {
  let id = event.params.orderId;
  let DDAA = DDAA_contract.bind(event.address);
  let customer = Customer.load(event.transaction.from.toHexString());
  let verifier = Verifier.load(DDAA.getOrder(id).verifier.toHexString());
  let order = Order.load(id.toString());

  if (!customer) {
    customer = new Customer(event.transaction.from.toHexString());
    customer.ordersSubmitted = 0;
  }
  if (!verifier) {
    verifier = new Verifier(DDAA.getOrder(event.params.orderId).verifier.toHexString());
    verifier.orders = 0;
  }
  if (!order) {
    order = new Order(event.params.orderId.toString());
    order.balance = DDAA.getOrder(id).balance;
    order.pricePerImage = DDAA.getOrder(id).pricePerImage;
    order.customer = DDAA.getOrder(id).customer;
    order.deadline = DDAA.getOrder(id).deadline;
    order.verifier = DDAA.getOrder(id).verifier;
    order.url = DDAA.getOrder(id).url;
  }

  customer.ordersSubmitted += 1;
  verifier.orders += 1;

  customer.save();
  verifier.save();
  order.save();
}

export function handlepaymentToAnnotator(event: paymentToAnnotator): void {
  let DDAA = DDAA_contract.bind(event.address);
  let id = event.params.orderId;
  let annotator = Annotator.load(event.params.annotator.toHexString());
  let order = Order.load(id.toString());

  if (!annotator) {
    annotator = new Annotator(event.params.annotator.toHexString());
    annotator.rewards = BigInt.fromU32(0);
  }
  if(!order) {
    log.warning("Payment to nonexistent order", []);
    order = new Order(id.toString());
    order.balance = DDAA.getOrder(id).balance;
    order.pricePerImage = DDAA.getOrder(id).pricePerImage;
    order.customer = DDAA.getOrder(id).customer;
    order.deadline = DDAA.getOrder(id).deadline;
    order.verifier = DDAA.getOrder(id).verifier;
    order.url = DDAA.getOrder(id).url;
  }

  annotator.rewards = annotator.rewards.plus(event.params.amount);
  order.balance = order.balance.minus(event.params.amount);
}
