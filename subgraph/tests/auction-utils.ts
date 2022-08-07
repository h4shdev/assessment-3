import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  auctionCreated,
  auctionEnded,
  bidCreated,
  highestBidIncreased,
  withdrawReq
} from "../generated/Auction/Auction"

export function createauctionCreatedEvent(
  beneficiary: Address
): auctionCreated {
  let auctionCreatedEvent = changetype<auctionCreated>(newMockEvent())

  auctionCreatedEvent.parameters = new Array()

  auctionCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "beneficiary",
      ethereum.Value.fromAddress(beneficiary)
    )
  )

  return auctionCreatedEvent
}

export function createauctionEndedEvent(
  winner: Address,
  amount: BigInt
): auctionEnded {
  let auctionEndedEvent = changetype<auctionEnded>(newMockEvent())

  auctionEndedEvent.parameters = new Array()

  auctionEndedEvent.parameters.push(
    new ethereum.EventParam("winner", ethereum.Value.fromAddress(winner))
  )
  auctionEndedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return auctionEndedEvent
}

export function createbidCreatedEvent(
  amount: BigInt,
  sender: Address
): bidCreated {
  let bidCreatedEvent = changetype<bidCreated>(newMockEvent())

  bidCreatedEvent.parameters = new Array()

  bidCreatedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  bidCreatedEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )

  return bidCreatedEvent
}

export function createhighestBidIncreasedEvent(
  bidder: Address,
  amount: BigInt
): highestBidIncreased {
  let highestBidIncreasedEvent = changetype<highestBidIncreased>(newMockEvent())

  highestBidIncreasedEvent.parameters = new Array()

  highestBidIncreasedEvent.parameters.push(
    new ethereum.EventParam("bidder", ethereum.Value.fromAddress(bidder))
  )
  highestBidIncreasedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return highestBidIncreasedEvent
}

export function createwithdrawReqEvent(
  amount: BigInt,
  sender: Address
): withdrawReq {
  let withdrawReqEvent = changetype<withdrawReq>(newMockEvent())

  withdrawReqEvent.parameters = new Array()

  withdrawReqEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  withdrawReqEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )

  return withdrawReqEvent
}
