export function dateToLocalDate(data){
        return data[8]+data[9]+"/"+data[5]+data[6]+"/"+data[0]+data[1]+data[2]+data[3] + " - " + data.slice(11,16)
}