package prices

import (
	"fmt"
	"log"
	"net/http"
)

func getTokenPrice() {
	fmt.Println("Getting token price")

	token := "0x2170Ed0880ac9A755fd29B2688956BD959F933F8"
	resp, err := http.Get("https://api.dexscreener.com/latest/dex/tokens/:tokenAddreses")
	if err != nil {
		log.Fatalln(err)
	}

	defer resp.Body.Close()

	bodyString := string(bodyBytes)
	fmt.Println("API Response as String:\n" + bodyString)

	//convert to struct to interact with data here
}
