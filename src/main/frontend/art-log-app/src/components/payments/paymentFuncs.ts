// external imports
import dayjs from 'dayjs';

// internal imports
import { Controller } from '@/restAPI/entities';

export async function getPaymentNum(id: number) {
    // initializations
    const requests = new Controller();
    const studentUrl = "http://localhost:8080/student/";

    const student = await requests.getById(studentUrl, id);

    return student.payment_number;
}

export async function addPaymentNum(id: number) {
    // initializations
    const requests = new Controller();
    const studentUrl = "http://localhost:8080/student/";

    const student = await requests.getById(studentUrl, id);
    const currentPaymentNum = student.payment_number + 1; // payment made, thus new table
    const data = {
        student_id: student.student_id,
        first_name: student.first_name,
        last_name: student.last_name,
        class_id: student.class_id,
        day: student.day,
        phone_number: student.phone_number,
        payment_number: currentPaymentNum,
        class_number: 0,
        notes: student.notes,
        payment_notes: student.payment_notes,
        time_expected: student.time_expected
    };

    await requests.edit(studentUrl, data);
    return currentPaymentNum;
}

export async function addNewPaymentTable(id: number, date: string, paymentNum: number) {
    // initializations
    const requests = new Controller();
    const attendanceUrl = "http://localhost:8080/attendance/";

    const data = {
        student_id: id,
        class_number: 1,
        date_expected: date,
        date_attended: null,
        check_in: null,
        hours: 1,
        check_out: null,
        payment_number: paymentNum
    };
    
    await requests.add(attendanceUrl, data);
    await generateClasses(id, date, paymentNum);
}

async function generateClasses(id: number, date: string, paymentNum: number) {
    // initializations
    const requests = new Controller();
    const attendanceUrl = "http://localhost:8080/attendance/";

    for (let i = 2; i <= 10; i++) {
        const nextClassDate = dayjs(date).add(7*(i-1), 'days').format('MMM D, YYYY');
        const data = {
            student_id: id,
            class_number: i,
            date_expected: nextClassDate,
            date_attended: null,
            check_in: null,
            hours: 1,
            check_out: null,
            payment_number: paymentNum
        };

        await requests.add(attendanceUrl, data);
    }
}