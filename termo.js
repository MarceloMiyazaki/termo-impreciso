let atual = 0
let linha = 5
const chave = "carro"

if(localStorage.getItem("tentou") != null) carregarDados()

window.addEventListener('keydown', (event) => {
    const key = event.key

    let regex = /^[a-zA-Z]$/

    if(key === 'Enter'){
        for(let i = linha-5; i < linha; i++){
            if(document.getElementById(`${i}`).value=="")return
        } 
        jogar()
    }

    if(key === 'Backspace' && atual >= linha-5){
        document.getElementById(`${atual}`).value = null
        if(atual!=linha-5) atual--
        document.getElementById(`${atual}`).focus()
        return
    }

    if(regex.test(key) && atual != linha){
        document.getElementById(`${atual}`).value = key.toLowerCase()
        if(atual!=linha-1) atual++
        document.getElementById(`${atual}`).focus()
    }

    if(key == "ArrowLeft" && atual > linha-5){
        atual -= 1
        document.getElementById(`${atual}`).focus()
    }

    if(key == "ArrowRight" && atual != linha-1){
        atual += 1
        document.getElementById(`${atual}`).focus()
    }
})

function jogar(){
    let palpite = ""
    let segredo = chave.split("")
    let out = [0,0]

    for(let i=linha-5;i<linha;i++){
        palpite += document.getElementById(`${i}`).value
    }
    console.log(palpite)

    for(let i=0;i<5;i++){
        if(chave[i]==segredo[i]){
            out[0] += 1
            segredo[i] = "!"
        }
    }

    for(let i=0;i<5;i++){
        if(segredo.includes(palpite[i]) && chave[i]!=palpite[i]){
            out[1] += 1
            segredo[segredo.indexOf(palpite[i])] = "!"
        }
    }

    if(out[0]===5){
        document.getElementById("coluna").style.display = "none"
        document.getElementById("result").style.display = "block"
        document.getElementById("body").style.backgroundColor = "#7dda75"
    }

    console.log(out)

    document.getElementById(`gab${linha}`).innerHTML = out[0]
    document.getElementById(`gab${linha+1}`).innerHTML = out[1]

    let anterior = []
    let gabs = []

    if(localStorage.getItem("tentou") != null) anterior = JSON.parse(localStorage.getItem("tentou"))
    anterior.push(palpite)

    if(localStorage.getItem("tentou") != null) gabs = JSON.parse(localStorage.getItem("gabs"))
    gabs.push(out)

    localStorage.setItem("tentou", JSON.stringify(anterior))
    localStorage.setItem("gabs", JSON.stringify(gabs))

    linha += 5
    atual++
    document.getElementById(`${atual}`).focus()
}

async function enviar(request){
    try {

        const response = await fetch(`http://localhost:8080/termo`, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' },
            body: request
        })

        data = await response.json()

        console.log(data)

        atualizar(data)

    } catch (error) {
        console.log("fudeo")
    }
    
}

function atualizar(result){

    for(let i = 0; i <= 5; i++){
        if(result[i] === "O") document.getElementById(`${i + linha - 5}`).style.backgroundColor = "rgba(93, 129, 79, 0.7)"
        if(result[i] === "!") document.getElementById(`${i + linha - 5}`).style.backgroundColor = "rgb(189, 172, 100)"
    }
    if(data != ["O","O","O","O","O"]) linha += 5
}

function mudar(element){
    if(element.id >= linha-5) {
        if(element.id < linha){
            atual = element.id
            element.focus()
        }
        element.blur()
        document.getElementById(`${atual}`).focus()
        return
    }

    element.blur()
    let bg = window.getComputedStyle(element).backgroundColor

    if(bg == "rgba(58, 58, 58, 0.7)") element.style.backgroundColor = "rgba(93, 129, 79, 0.7)"
    if(bg == "rgba(93, 129, 79, 0.7)") element.style.backgroundColor = "rgb(189, 172, 100)"
    if(bg == "rgb(189, 172, 100)") element.style.backgroundColor = "rgb(255, 130, 130)"
    if(bg == "rgb(255, 130, 130)") element.style.backgroundColor = "rgba(58, 58, 58, 0.7)"
    document.getElementById(`${atual}`).focus()
}

function carregarDados(){
    let anterior = JSON.parse(localStorage.getItem("tentou"))
    let gabs = JSON.parse(localStorage.getItem("gabs"))

    for(i=0; i < 5*anterior.length; i++){
        document.getElementById(`${i}`).value = anterior[Math.floor(i/5)][i-((Math.floor(i/5))*5)].toLowerCase()
        atual++

        if(atual%5===0) enviar(anterior[Math.floor(i/5)])
    }

    for(let i=1; i < gabs.length+1; i++){
        if(gabs[i-1][0]===5){
            document.getElementById("coluna").style.display = "none"
            document.getElementById("result").style.display = "block"
            document.getElementById("body").style.backgroundColor = "#7dda75"
            return
        }

        document.getElementById(`gab${i*5}`).innerHTML = gabs[i-1][0]
        document.getElementById(`gab${i*5+1}`).innerHTML = gabs[i-1][1]
    }

    linha = linha + anterior.length*5
}



function limpar(){
    localStorage.clear()
    window.location.reload()
}

document.getElementById(`${atual}`).focus()
