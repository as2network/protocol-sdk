import { Currency, TokenAmount, CurrencyAmount, JSBI, Token } from '@uniswap/sdk'
import { parseUnits } from 'ethers/lib/utils'
// try to parse a user entered amount for a given token
export function tryParseAmount(value?: string, currency?: Currency): CurrencyAmount | undefined {
    if (!value || !currency) {
        return undefined
    }
    try {
        const typedValueParsed = parseUnits(value, currency.decimals).toString()
        if (typedValueParsed !== '0') {
            return currency instanceof Token
                ? new TokenAmount(currency, JSBI.BigInt(typedValueParsed))
                : CurrencyAmount.ether(JSBI.BigInt(typedValueParsed))
        }
    } catch (error) {
        // should fail if the user specifies too many decimal places of precision (or maybe exceed max uint?)
        console.debug(`Failed to parse input amount: "${value}"`, error)
    }
    // necessary for all paths to return a value
    return undefined
}
