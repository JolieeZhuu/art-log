import * as React from "react"

// Internal imports
import { columns, type Checkout } from "@/components/checkout-tables/checkout-columns"
import { DataTable } from "@/components/checkout-tables/checkout-data-table"

export default function CheckoutTable({ checkoutData } : { checkoutData: Checkout[] }) {

    // Variable initializations
    const [data, setData] = React.useState<Checkout[]>([]) // Used to handle async function with useEffect

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