import { useState, useEffect } from "react"
import { Archive } from "lucide-react"

import { useParams } from "react-router-dom"

import {
    Card,
    CardAction,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import Layout from "@/components/layout"
import { ModeToggle } from "@/components/mode-toggle"
import { SiteHeader } from "@/components/site-header"

import { Controller } from "@/restAPI/entities"
import { DialogPaymentForm } from "@/components/dialog-payment-form"
import PaymentTable from "@/components/payments/page"

import { getPaymentNum } from "@/components/payments/paymentFuncs"

type Student = {
    student_id: number
    first_name: string
    last_name: string
    day: string
    class_id: string
    phone_number: string
    time_expected: string
}

export function PaymentsPage() {
    const { id: idParam } = useParams()
    if (!idParam) {
        return <div>Invalid ID parameter.</div>
    }

    const id = parseInt(idParam)
    const [student, setStudent] = useState<Student | null>(null);
    const [cardList, setCardList] = useState<React.ReactElement[]>([])

    const requests = new Controller()
    const studentUrl = "http://localhost:8080/student/"

    useEffect(() => {
        studentHeader()
        loadCards()
    }, [id])

    async function studentHeader() {
        const storeStudent = await requests.getById(studentUrl, id)
        setStudent(storeStudent)
    }

    async function loadCards() {
        const num = await getPaymentNum(id)
        console.log(num)
        let tempNum;
        if (num >= 2) {
            tempNum = 2;
        } else {
            tempNum = num;
        }
        const cards = Array.from({length: tempNum}).map((_, index) => {
            return (
                <div key={index} className="w-full max-w-7xl">
                    <Card>
                        <CardHeader className="justify-items-start">
                            <CardTitle>Payment Table {num - index}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <PaymentTable studentId={id} paymentNumber={num - index}/>
                        </CardContent>
                    </Card>
                </div>
            )
        })
        setCardList(cards);
    }

    return (
        <Layout
            children={(
                <div className="max-w-screen">
                    <SiteHeader heading={`${student?.first_name} ${student?.last_name}`}/>
                    <div className="flex justify-between items-center gap-4 pt-4">
                        <div className="flex gap-4">
                            <Badge variant="secondary">{student?.day[0]}{student?.day.substring(1)}</Badge>
                            <Badge variant="secondary">{student?.time_expected}</Badge>
                            <Badge variant="secondary">{student?.class_id}</Badge>
                            <Badge variant="secondary">{student?.phone_number}</Badge>
                        </div>
                        <DialogPaymentForm id={id}/>
                    </div>

                    <div className="flex flex-wrap gap-4 pt-4">
                        {cardList}
                        <div className="absolute top-4 right-4">
                            <ModeToggle/>
                        </div>
                    </div>
                    <div className="fixed bottom-4 right-4">
                        <Button variant="outline" size="icon">
                            <Archive className="h-[1.2rem] w-[1.2rem]"/>
                            <span className="sr-only">Payment table archives</span>
                        </Button>
                    </div>
                </div>
            )}
        />
    )
}