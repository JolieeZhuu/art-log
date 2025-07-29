// external imports
import dayjs from 'dayjs'

import { useState, useEffect, useRef } from "react"
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

import { AttendanceController } from "@/restAPI/entities"
import { DialogPaymentForm } from "@/components/dialog-payment-form"
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

export function PaymentsPage() {
    const { id: idParam } = useParams()
    if (!idParam) {
        return <div>Invalid ID parameter.</div>
    }

    const id = parseInt(idParam)
    const [student, setStudent] = useState<Student | null>(null)
    const [cardList, setCardList] = useState<React.ReactElement[]>([])
    const tableRefreshFunctions = useRef<{ [paymentNumber: number]: () => void }>({});

    const requests = new AttendanceController()
    const studentUrl = "http://localhost:8080/student/"
    const attendanceUrl = "http://localhost:8080/attendance/"

    useEffect(() => {
        getStudent()
        loadCards()
    }, [id])

    async function getStudent() {
        const storeStudent = await requests.getById(studentUrl, id)
        setStudent(storeStudent)
    }

    async function addClass(paymentNumber: number) {    
        // get the date of the last class of payment table
        const student = await requests.getById(studentUrl, id)
        const totalClasses = student.total_classes
        const lastClass = await requests.getByPaymentNumberAndStudentIdAndClassNumber(attendanceUrl, paymentNumber, id, totalClasses)
    
        // generate new class 7 days apart
        const lastDate = lastClass.date_expected
        const nextClassDate = dayjs(lastDate).add(7, 'days').format('MMM D, YYYY')
        console.log(nextClassDate)
        const data1 = {
            student_id: id,
            class_number: totalClasses + 1,
            date_expected: nextClassDate,
            date_attended: null,
            check_in: null,
            hours: 1,
            check_out: null,
            payment_number: paymentNumber,
        }
    
        await requests.add(attendanceUrl, data1)
    
        // edit the student so that total classes += 1
        const data2 = {
            student_id: id,
            first_name: student.first_name,
            last_name: student.last_name,
            class_id: student.class_id,
            day: student.day,
            phone_number: student.phone_number,
            time_expected: student.time_expected,
            payment_notes: student.payment_notes,
            notes: student.notes,
            payment_number: student.payment_number,
            class_number: student.class_number,
            total_classes: totalClasses + 1,
        }
    
        await requests.edit(studentUrl, data2)

        if (tableRefreshFunctions.current[paymentNumber]) {
            tableRefreshFunctions.current[paymentNumber]();
        }
    }

    const handleTableReady = (paymentNumber: number) => (refreshFn: () => void) => {
        tableRefreshFunctions.current[paymentNumber] = refreshFn;
    };

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
                            <CardAction>
                                <Button variant="outline" onClick={() => addClass(num - index)}>Add Class</Button>
                            </CardAction>
                        </CardHeader>
                        <CardContent>
                            <PaymentTable studentId={id} paymentNumber={num - index} onClassAdded={handleTableReady(num - index)}/>
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
                <div className="max-w-screen p-[2rem]">
                    <div className="absolute top-4 right-4">
                        <ModeToggle/>
                    </div>
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link to="/students">Students</Link>
                            </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                            <BreadcrumbPage>{`${student?.first_name} ${student?.last_name}`}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <div className="mt-4">
                        <SiteHeader heading={`${student?.first_name} ${student?.last_name}`}/>
                        <div className="flex justify-between items-center gap-4 pt-4">
                            <div className="flex gap-4">
                                <Badge variant="secondary">{student?.day[0]}{student?.day.substring(1)}</Badge>
                                <Badge variant="secondary">{student?.time_expected}</Badge>
                                <Badge variant="secondary">{student?.class_id}</Badge>
                                <Badge variant="secondary">{student?.phone_number}</Badge>
                            </div>
                            <div className="flex gap-4">
                                <DialogPaymentForm id={id} onPaymentAdded={loadCards}/>
                                <Button variant="outline" size="icon" asChild>
                                    <a href={`#/students/${id}/archives`}>
                                        <Archive className="h-[1.2rem] w-[1.2rem]"/>
                                        <span className="sr-only">Payment table archives</span>
                                    </a>
                                </Button>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-4 pt-4">
                            {cardList}
                        </div>
                    </div>
                </div>
            )}
        />
    )
}