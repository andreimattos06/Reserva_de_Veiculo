export function hourValidate(hour){
        let hora = hour[0]+hour[1]
        let minutos = hour[3]+hour[4]
        if (hora > 24 || hora < 0){
                return "24:"+minutos
        }
        else if(minutos > 59 || minutos < 0){
                return hora+":59"
        }
        else if(hora == 24 && minutos > 0){
                return "24:00"

        }
        else{
                return hour
        }
                
}