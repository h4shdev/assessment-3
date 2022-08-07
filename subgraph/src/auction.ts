import { BigInt } from "@graphprotocol/graph-ts"
import {
  Auction,
  auctionCreated,
  auctionEnded,
  bidCreated,
  highestBidIncreased,
  withdrawReq
} from "../generated/Auction/Auction"
import { AuctionEntity } from "../generated/schema"

export function handleauctionCreated(event: auctionCreated): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let entity = AuctionEntity.load(event.transaction.from.toHex())

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (!entity) {
    entity = new AuctionEntity(event.transaction.from.toHex())

    // Entity fields can be set using simple assignments
    // entity.count = BigInt.fromI32(0)
  }

  // BigInt and BigDecimal math are supported
  // entity.count = entity.count + BigInt.fromI32(1)

  // Entity fields can be set based on event parameters
  entity.beneficiary = event.params.beneficiary

  // Entities can be written to the store with `.save()`
  entity.save()

}

export function handleauctionEnded(event: auctionEnded): void {
  let entity = AuctionEntity.load(event.transaction.from.toHex())

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (!entity) {
    entity = new AuctionEntity(event.transaction.from.toHex())
  }
  entity.auctionEnded = true;
  entity.save();
}

export function handlebidCreated(event: bidCreated): void {}

export function handlehighestBidIncreased(event: highestBidIncreased): void {
  let entity = AuctionEntity.load(event.transaction.from.toHex())

  if (!entity) {
    entity = new AuctionEntity(event.transaction.from.toHex())
  }
  entity.highestBidder = event.params.bidder
  entity.highestBid = event.params.amount
  
  entity.save();
}

export function handlewithdrawReq(event: withdrawReq): void {}
