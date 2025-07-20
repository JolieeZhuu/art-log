import { useState, useEffect } from "react"

import { useParams } from "react-router-dom"

import {
    Card,
    CardAction,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import Layout from "@/components/layout"
import { SiteHeader } from "@/components/site-header"
import { ModeToggle } from "@/components/mode-toggle"

import { Controller } from "@/restAPI/entities"

import PaymentTable from "@/components/payments/payments-table-page"

import { getPaymentNum } from "@/components/payments/payment-funcs"

import { Link } from "react-router-dom"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

type Student = {
    student_id: number
    first_name: string
    last_name: string
    day: string
    class_id: string
    phone_number: string
    time_expected: string
}

export function Archives() {
    const { id: idParam } = useParams()
    if (!idParam) {
        return <div>Invalid ID parameter.</div>
    }

    const id = parseInt(idParam)
    const [student, setStudent] = useState<Student | null>(null)
    const [cardList, setCardList] = useState<React.ReactElement[]>([])

    const requests = new Controller()
    const studentUrl = "http://localhost:8080/student/"
    
    useEffect(() => {
        getStudent()
        loadCards()
    }, [id])
    
    async function getStudent() {
        const storeStudent = await requests.getById(studentUrl, id)
        setStudent(storeStudent)
    }

    async function loadCards() {
        const num = await getPaymentNum(id)
        const cards = Array.from({length: num}).map((_, index) => {
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
        setCardList(cards)
    }

    return (
        <Layout
            children={(
                <div className="w-[73rem]">
                    <div className="flex">
                        <Breadcrumb className="pr-3">
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                <BreadcrumbLink asChild>
                                    <Link to="/students">Students</Link>
                                </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                <BreadcrumbLink asChild>
                                    <Link to={`/students/${id}`}>{`${student?.first_name} ${student?.last_name}`}</Link>
                                </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                <BreadcrumbPage>Archives</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    <div className="mt-4">
                        <SiteHeader heading={`Archived Payment Tables for ${student?.first_name} ${student?.last_name}`}/>

                        <div className="flex flex-wrap gap-4 pt-4">
                            {cardList}
                            <div className="absolute top-4 right-4">
                                <ModeToggle/>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        />
    )
}