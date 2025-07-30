// external imports
import dayjs from 'dayjs'

// internal imports
import { AttendanceController, Controller } from '@/restAPI/entities'

export async function getPaymentNum(id: number) {
    // initializations
    const requests = new AttendanceController()
    const studentUrl = "http://localhost:8080/student/"

    const student = await requests.getById(studentUrl, id)

    return student.payment_number
}

export async function addPaymentNum(id: number) {
    // initializations
    const requests = new AttendanceController()
    const studentUrl = "http://localhost:8080/student/"

    const student = await requests.getById(studentUrl, id)
    const currentPaymentNum = student.payment_number + 1 // payment made, thus new table
    const data = {
        student_id: student.student_id,
        first_name: student.first_name,
        last_name: student.last_name,
        class_id: student.class_id,
        day: student.day,
        phone_number: student.phone_number,
        time_expected: student.time_expected,
        notes: student.notes,
        payment_notes: student.payment_notes,
        payment_number: currentPaymentNum,
        class_number: 0,
        total_classes: student.total_classes,
    }

    await requests.edit(studentUrl, data)
    return currentPaymentNum
}

export async function addNewPaymentTable(id: number, date: string, paymentNum: number, numOfClasses: number) {
    // initializations
    const requests = new AttendanceController()
    const attendanceUrl = "http://localhost:8080/attendance/"
    const studentUrl = "http://localhost:8080/student/"
    const student = await requests.getById(studentUrl, id)

    const data1 = {
        student_id: id,
        class_number: 1,
        date_expected: date,
        date_attended: null,
        check_in: null,
        hours: 1,
        check_out: null,
        payment_number: paymentNum
    }

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
        total_classes: numOfClasses,
    }
    
    await requests.add(attendanceUrl, data1)
    await generateClasses(id, date, paymentNum, numOfClasses) // generates remaining 

    await requests.edit(studentUrl, data2)
}

async function generateClasses(id: number, date: string, paymentNum: number, numOfClasses: number) {
    // initializations
    const requests = new AttendanceController()
    const attendanceUrl = "http://localhost:8080/attendance/"

    for (let i = 2; i <= numOfClasses; i++) {
        const nextClassDate = dayjs(date).add(7*(i-1), 'days').format('MMM D, YYYY')
        const data = {
            student_id: id,
            class_number: i,
            date_expected: nextClassDate,
            date_attended: null,
            check_in: null,
            hours: 1,
            check_out: null,
            payment_number: paymentNum
        }

        await requests.add(attendanceUrl, data)
    }
}

export async function getTotalClasses(studentId: number) {
    const requests = new Controller()
    const studentUrl = "http://localhost:8080/student/"

    const student = await requests.getById(studentUrl, studentId)
    return student.total_classes
}