// External imports
import dayjs from 'dayjs'

// Internal imports
import { getById, edit, add, getByPaymentNumberAndStudentIdAndClassNumber, } from '@/restAPI/entities'

// Initializations
const studentUrl = "http://localhost:8080/student/"
const attendanceUrl = "http://localhost:8080/attendance/"

export async function getPaymentNum(id: number) {

    const student = await getById(studentUrl, id)

    return student.payment_number
}

export async function addPaymentNum(id: number) {
    const student = await getById(studentUrl, id)
    const currentPaymentNum = student.payment_number + 1 // Payment made, thus new table
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
        class_hours: student.class_hours,
    }

    await edit(studentUrl, data)
    return currentPaymentNum
}

export async function addNewPaymentTable(id: number, date: Date, paymentNum: number, numOfClasses: number) {
    const student = await getById(studentUrl, id)

    const data1 = {
        student_id: id,
        class_number: 1,
        date_expected: date,
        date_attended: null,
        check_in: null,
        hours: 1,
        check_out: null,
        payment_number: paymentNum
    } // Make changes to Student entity

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
        class_hours: student.class_hours
    } // Make changes to Attendance entity
    
    await add(attendanceUrl, data1)
    await generateClasses(id, date.toString(), paymentNum, numOfClasses) // generates remaining 

    await edit(studentUrl, data2)
}

async function generateClasses(id: number, date: string, paymentNum: number, numOfClasses: number) {
    // Generates remaining classes after the first one
    // Classes are 7 days apart
    for (let i = 2; i <= numOfClasses; i++) {
        const nextClassDate = dayjs(date).add(7*(i-1), 'days').toDate()
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

        await add(attendanceUrl, data)
    }
}

export async function getTotalClasses(studentId: number) {
    const student = await getById(studentUrl, studentId)
    return student.total_classes
}

export async function addClass(paymentNum: number, id: number) {
    const student = await getById(studentUrl, id)
    const totalClasses = student.total_classes
    const lastClass = await getByPaymentNumberAndStudentIdAndClassNumber(attendanceUrl, paymentNum, id, totalClasses)

    // Generate the new class 7 days apart from the last class
    const lastDate = lastClass.date_expected
    const nextClassDate = dayjs(lastDate).add(7, 'days').toDate()
    console.log(nextClassDate)
    const data1 = {
        student_id: id,
        class_number: totalClasses + 1,
        date_expected: nextClassDate,
        date_attended: null,
        check_in: null,
        hours: 1,
        check_out: null,
        payment_number: paymentNum,
    }

    await add(attendanceUrl, data1)

    // Edit the student so that total classes += 1
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
        class_hours: student.class_hours,
    }

    await edit(studentUrl, data2)
}

