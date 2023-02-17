
export function getTimeString(start : Date, now : Date) : string {
    const dmilli = now.getMilliseconds() - start.getMilliseconds();
    const dsecs = now.getSeconds() - start.getSeconds();
    const dmin = now.getMinutes() - start.getMinutes();
    const dhour = now.getHours() - start.getHours();
    const ddays = now.getDay() - start.getDay();
    var delta = dmilli + 1000 * (dsecs + 60 * (dmin + 60 * (dhour + 24 * ddays)));
    if (delta < 0)
    {
        delta = 0;
    }
    const mins = Math.floor(delta / 1000 / 60);
    delta = delta - mins * 1000 * 60;
    const secs = Math.floor(delta / 1000);
    delta = delta - secs * 1000;
    const subsecs = Math.floor(delta/100);
    return ("0" + mins).slice(-2) + ":" + ("0" + secs).slice(-2) + "." + subsecs
}