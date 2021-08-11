export function formatDate(date) {
    return new Date(date).toLocaleString();
}

export function formatDateToLocal(date) {
    return new Date(date).toLocaleDateString(
        'en-us', {  year: "numeric", month: "short", day: "numeric" }
    )
}