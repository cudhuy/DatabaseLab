export function formatInteger(x) {
    let number = parseInt(x) + "";
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
