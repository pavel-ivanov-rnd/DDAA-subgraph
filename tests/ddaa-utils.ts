import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import { orderSubmitted, paymentToAnnotator } from "../generated/DDAA/DDAA"

export function createorderSubmittedEvent(
  orderId: BigInt,
  verifier: Address
): orderSubmitted {
  let orderSubmittedEvent = changetype<orderSubmitted>(newMockEvent())

  orderSubmittedEvent.parameters = new Array()

  orderSubmittedEvent.parameters.push(
    new ethereum.EventParam(
      "orderId",
      ethereum.Value.fromUnsignedBigInt(orderId)
    )
  )
  orderSubmittedEvent.parameters.push(
    new ethereum.EventParam("verifier", ethereum.Value.fromAddress(verifier))
  )

  return orderSubmittedEvent
}

export function createpaymentToAnnotatorEvent(
  orderId: BigInt,
  annotator: Address,
  amount: BigInt
): paymentToAnnotator {
  let paymentToAnnotatorEvent = changetype<paymentToAnnotator>(newMockEvent())

  paymentToAnnotatorEvent.parameters = new Array()

  paymentToAnnotatorEvent.parameters.push(
    new ethereum.EventParam(
      "orderId",
      ethereum.Value.fromUnsignedBigInt(orderId)
    )
  )
  paymentToAnnotatorEvent.parameters.push(
    new ethereum.EventParam("annotator", ethereum.Value.fromAddress(annotator))
  )
  paymentToAnnotatorEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return paymentToAnnotatorEvent
}
