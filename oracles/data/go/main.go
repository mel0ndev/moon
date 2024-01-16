package main

import (
	"fmt"

	"github.com/umbracle/ethgo/jsonrpc"
)

func main() {

	client, err := jsonrpc.NewClient("http://localhost:8545")
	if err != nil {
		panic(err)
	}

	number, err := client.Eth().BlockNumber()
	if err != nil {
		panic(err)
	}

	fmt.Printf("the block number is: %v", number)
}
