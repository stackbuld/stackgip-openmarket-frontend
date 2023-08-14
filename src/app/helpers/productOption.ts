import { numberWithCommas } from "./number-format"

export function formatProductOptions(options:string){
    options = options || `{"size":"M"}`
    const opts:{[key:string]:string} = JSON.parse(options)
    let formatOpts:string = ""
    for(let option in opts){
      formatOpts += `${option}|${opts[option]}<br>`
    }
    return formatOpts
}

export function formatShipmentOption(options:string){
    options = options || `{"state":"state","city":"city","cost":"0"}`
    const opt:{state:string,city:string,cost:string} = JSON.parse(options)
    return `${opt.state} / ${opt.city} (+NGN${numberWithCommas(opt.cost || 0)})`
}
