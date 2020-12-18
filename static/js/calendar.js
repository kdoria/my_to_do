const date = new Date();
const months = [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December"];

let currentmonth = date.getMonth();
let currentyear = date.getFullYear();


console.log(date);
console.log(months[date.getMonth()]);

document.querySelector('#next-month').addEventListener('click', nextMonth);
document.querySelector('#prev-month').addEventListener('click',prevMonth);
document.querySelector('#due-date').addEventListener('input',function () {
                                                document.querySelector("#calendar-container").style.display = flex;
                                                showCalendar();
                                            });

const showCalendar = () => {

    const showToday = () =>{
        let todayDate = new Date();
        console.log(todayDate.getDate());

        if (todayDate.getMonth() === currentmonth && todayDate.getFullYear()===currentyear) {
            let days = document.querySelector('#showdays').querySelectorAll('.current-month-days'); 
            console.log(days);
            for (i=0;i<days.length;i++){
                console.log(days[i].textContent);
                if (days[i].textContent === todayDate.getDate().toString()) {
                    days[i].classList.add('today');
                    break;
                }
            }
            
        }

    }

    let month = currentmonth;
    let year = currentyear;
    // display month and year
    let currentMonth = document.querySelector('#current-month');
    let currentYear = document.querySelector('#current-year');

    currentMonth.textContent = months[month];
    currentYear.textContent = year.toString();

    // Display previous days
    let firstday = new Date(year, month, 1).getDay();
    // Difference from first day of the week to the init of the month
    let diffdays = Math.abs(0 - firstday);

    if (diffdays > 0) {
        let prevMonthLastDay = new Date(year,month,0).getDate();

        let initprevMonthDay = prevMonthLastDay - diffdays + 1;

        for (let day = initprevMonthDay;day <= prevMonthLastDay; day++){
            let prevdaydiv = document.createElement('div');
            prevdaydiv.classList.add('prev-date');
            prevdaydiv.textContent = day;
            document.querySelector('.days').appendChild(prevdaydiv);
        }

    }

    let nextMonth = (month===11)? 0 : month + 1;
    let nextYear = (month===11)? year + 1 : year;

    // Display days of the month
    let lastday = new Date(nextYear, nextMonth, 0).getDate();
    console.log(lastday);

    for (let i=1;i<=lastday;i++){
        let datediv = document.createElement('div');
        datediv.classList.add('current-month-days');
        datediv.textContent = i;
        document.querySelector('.days').appendChild(datediv);
    }

    showToday();
    
}

const cleanCalendar = () => {

    let days = document.querySelector('#showdays').querySelectorAll('div');
    
    for (i=0;i<days.length; i++){

        days[i].remove();
    }

}

function nextMonth() {

    let nextMonth = (currentmonth===11)? 0 : currentmonth + 1;
    let nextMonthYear = (currentmonth === 11)? currentyear + 1 : currentyear;

    currentmonth = nextMonth;
    currentyear = nextMonthYear;

    cleanCalendar();
    showCalendar();

}

function prevMonth() {
    
    let prevMonth = (currentmonth === 0)? 11 : currentmonth - 1;
    let prevMonthyear = (currentmonth === 0)? currentyear - 1 : currentyear;

    currentmonth = prevMonth;
    currentyear = prevMonthyear;

    cleanCalendar();
    showCalendar();    

}

const initCalendar = () => {

    document.querySelector("#calendar-container").style.display = flex;
    showCalendar();

}

showCalendar();