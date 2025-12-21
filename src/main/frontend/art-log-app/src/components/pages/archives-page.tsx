import { useState, useEffect } from "react"

import { useParams } from "react-router-dom"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { ModeToggle } from "@/components/dark-light-mode/mode-toggle"

import { getById } from "@/restAPI/entities"

import PaymentTable from "@/components/payment-tables/payments-table-page"

import { getPaymentNum } from "@/components/payment-tables/payment-funcs"

import { Link } from "react-router-dom"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { Separator } from "../ui/separator"
import { AppSidebar } from "@/components/navbar/app-sidebar"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"

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

    const studentUrl = "http://localhost:8080/student/"
    
    useEffect(() => {
        getStudent()
        loadCards()
    }, [id])
    
    async function getStudent() {
        const storeStudent = await getById(studentUrl, id)
        setStudent(storeStudent)
    }

    async function loadCards() {
        const num = await getPaymentNum(id)
        const cards = Array.from({length: num}).map((_, index) => {
            return (
                <div key={index} className="w-full">
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
        <SidebarProvider>
            <AppSidebar/>
            <SidebarInset>
                <header className="flex h-20 shrink-0 items-center gap-2 border-b px-4">
                    <div className="space-y-2">
                        <div className="flex gap-5">
                            <Breadcrumb>
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
                            <Separator
                                orientation="vertical"
                                className="data-[orientation=vertical]:h-5"
                            />
                            <p className="text-sm">Go to <Link to={`/day/${student?.day}`}>{student?.day} Checkout</Link></p>
                        </div>
                        <p className="text-base font-medium">Archived Payment Tables for {student?.first_name} {student?.last_name}</p>
                    </div>
                </header>
                <div className="p-4">
                    <div>

                        <div className="flex flex-wrap gap-4">
                            {cardList}
                            <div className="absolute top-4 right-4">
                                <ModeToggle/>
                            </div>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}