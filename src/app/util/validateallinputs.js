export function validateAllInputs(lista){
        let keys = Object.keys(lista)
        for (let i=0; i<keys.length; i++){
                if (lista[keys[i]] == false){
                        return false
                }
        }
        return true
}