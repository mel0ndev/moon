#! /usr/bin/bash

PRIVATE_KEY=""
UPDATER="0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
NAME="ETH_BASE"

forge c src/OracleRegistry.sol:OracleRegistry --private-key $PRIVATE_KEY && 
forge c src/BaseAggregatedOracle.sol:BaseAggregatedOracle --private-key $PRIVATE_KEY --constructor-args $UPDATER $NAME
