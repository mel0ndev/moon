#Bone Finance


##### What is Bone? 
Bone is a custom solution to a custom problem. How can we capture degenerate yileds on chain whithout having to purchase dogshit coins and be exposed to their wild swings? The answer is simple. We need to be able to negate the positive deltas in our portfolio with a negative delta equivalent. But where do we find access to negative deltas on dogshit? Well, you can't. Not really. 

Thus, we introduce Bone Finance. 

##### How it works
The user will purchase a dogshit token from a dex or cex with the appropriate funds. They then come to Bone, where the deposit it into a locked pool. They will receive a stablecoin loan back from the protocol, equivalent to the USD price at the time of lock, thus creating a short position. The trader can then purchase more dogshit token, and use their stablecoin short as a hedge against the price of dogshit going down, keeping in mind that their short position will be liquidated if they fail to close the position if it moves against them. They will receive up to 100% of the collateral they deposit into the protocol as a stablecoin. If their position draws down more than it is worth, the position will be liquidated and the user will lose 100% of their funds. Prior to lockup, they must also post 5% of the position as a stablecoin in case of liquidated that will be forfeited to LPs upon liquidation. 

I.E. the user has received 100 USDC for depositing 100 DOG, assuming an exchange rate of 1:1. As the price of DOG increases, the position enters drawdown. Once the DOG becomes more valuable than the USDC loan, the protocol will liquidate the tokens and reimburse the stablecoin LPs by selling the token on a dex, and distributing the stablecoin deposit. So, the closing price of the short must mean that the USDC loan is redeemable for only 5% of the original DOG tokens at the time of closing. For instance, if DOG were to 2x and become worth $2.00, the initial 100 USDC loan would still be able to purchase 50 DOG tokens back from the protocol, resulting in a 50% loss on USDC. However, once the USDC loan can only purchase 5% or less of the position back, the entire position is liquidated. In this case, the token would have to more than 10x. This lets users feel comfortable leaving their delta neutral positions open while the token rises, and not feel immediate pressure to close.  

Keep in mind that this position is *supposed* to be paired with an equivalent long position in the users portfolio, however, the protocol can also be used to naked short dogshit as well. Keep in mind, however, that this exposes you the rapid upward (and downward) swings that this protocol aims to avoid. But, in the interest of composability, we have chosen to allow the users to dictate where and when they LP their funds. 

