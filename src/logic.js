export function validateBookingDates(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new Error('Ungültiges Datum');
    }

    if (end <= start) {
        throw new Error('Enddatum muss nach dem Startdatum liegen');
    }

    return { start, end };
}
export function calculateTotalPrice(dailyRate, startDate, endDate) {
    if (typeof dailyRate !== 'number' || dailyRate <= 0) {
        throw new Error('Ungültiger Tagespreis');
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return days * dailyRate;
}

export function isEmailValid(email) {
    if (!email) return false;
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}
export function filterAvailableCameras(cameras) {
    if (!Array.isArray(cameras)) {
        throw new Error('Ungültiges Datenformat: Array erwartet');
    }
    return cameras.filter(cam => cam.status === 'available');
}