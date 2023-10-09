export function formatDate(timestamp) {
    function zeroPadding(num) {
        if (num < 10) {
            return '0' + num
        }
        return num
    }
    const date = new Date(parseInt(timestamp));

    const year = date.getFullYear();
    const month = zeroPadding(date.getMonth() + 1);
    const day = zeroPadding(date.getDate());

    const hour = zeroPadding(date.getHours());
    const minutes = zeroPadding(date.getMinutes());
    const seconds = zeroPadding(date.getSeconds());

    const weekArr = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const week = weekArr[date.getDay()];

    return year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds + ' ' + week
}