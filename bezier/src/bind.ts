
const store = {}


export function bind(el: string, obj?: any) {
    let e = document.querySelector(el)
    if (e) {
        return new Bind(e, obj)
    } else {
        throw new Error(`Element "${el}" does not exist.`)
    }


}

type Value<T> = {
    v: T
}

let watcher = {
    // get: function (target: any, p: string | symbol, receiver: any): any {
    //     console.log(`${target}.${String(p)}`)
    //     return target[p]
    // },
    set: function (target: any, p: string | symbol, value: any, receiver: any): boolean {
        console.log(target, p, value)
        target[p] = value
        return true
    }
}


function render() {

}

class Bind<T> {
    private el: Element
    private data: any
    public proxy: any
    constructor(el: Element, data: T) {
        let v: Value<T> = { v: data }
        this.proxy = new Proxy(v, watcher)
        this.el = el
        this.data = data

        this.val = data



        if (el instanceof HTMLInputElement) {
            el.addEventListener("change", (e: Event) => {
                console.log("chenge")
                if (e.target != null) {

                    switch (el.type) {
                        case "range":
                            this.data = el.value
                            this.proxy.v = el.value
                            break
                        case "checkbox":
                            this.data = el.checked
                            this.proxy.v = el.checked
                            break
                        default:
                            this.data = el.value
                            this.proxy.v = el.value
                            break
                    }
                }

            })
        }
    }


    public get val(): any {
        // console.log(this.proxy.v)
        return this.data
    }


    public set val(v: any) {
        // console.log(this.proxy.v)
        this.data = v;
        this.proxy.v = v

        if (this.el instanceof HTMLInputElement) {
            console.log('settting')
            if (this.data) {
                this.el.checked = true
                this.el.value = this.proxy.v
            } else {
                this.el.checked = false
            }
        } else {
            this.el.innerHTML = this.proxy.v
        }
    }


}