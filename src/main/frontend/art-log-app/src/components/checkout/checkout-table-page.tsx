import * as React from "react"

import { columns, type Checkout } from "@/components/checkout/checkout-columns"
import { DataTable } from "@/components/checkout/checkout-data-table"

export default function CheckoutTable({ checkoutData } : { checkoutData: Checkout[] }) {

    // variable initializations
    const [data, setData] = React.useState<Checkout[]>([]) // used to handle async function with useEffect

    async function getData(): Promise<Checkout[]> {
        return checkoutData
    }

    React.useEffect(() => {
        getData().then((data) => setData(data))
    })

    return (
        <DataTable columns={columns} data={data} />
    )
}