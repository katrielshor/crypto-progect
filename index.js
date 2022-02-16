
// Page mode 
const pages = {
    'coins': `
    `,
    'Followed': ``,
    'about': `    <div class="about">
    <div class="text">

    Created by   <span> katriel </span>shor
                   <br/>0583204567
                   <br/>katriel.shor@gmail.com
  </div>
  </div>`,
}

//Page mode selector
const loadPage = (page) => {
    let getPage = ""
    switch (page) {
        case 'coins':
            getPage = pages.coins
            break;
        case 'Followed':
            getPage = pages.Followed
            break;
        case 'about':
            getPage = pages.about
            break;

        default:
            getPage = pages.coins
            break;
    }
    document.getElementById("div").innerHTML = getPage
}


$(() => {
    $("#modal-btn").hide()
    $("#Progress").hide()

    //function to load coins from api
    $("#coinsButton").click(async function () {
        $("#Progress").show()
       //main currency api
        const List = await getData(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd`)

        $("#Progress").hide()
        for (i = 0; i < 21; i++) {

            $("#board").append(`
            <div class="col-sm-4" id="card">
             <div class="card shadow" >
               <div class="card-body"><div class="form-check form-switch" div="switch">
                <input class="form-check-input" name="${List[i].symbol}" type="checkbox"  id="${List[i].name}">
                 <label class="form-check-label" for="flexSwitchCheckDefault" ></label>
            </div>
                <h5 class="card-title">${List[i].symbol}</h5>
                <p class="card-text">${List[i].name}</p>
                
            <button id="${List[i].id}" type="button" class="btn btn-primary more-info-button">more info</button>
            <div id="${List[i].id}"></div>

  
              </div>
            </div>
          </div>
            `)
        }
        loadMoreInfo()

    })

    //toggle handle block
    let counter = 0


    $(document).on("click", ".form-check-input:checkbox:checked", function () {
        counter ++
        if (counter ==2) {
            ModalAction()
           myModal.show()
        }
        if (counter > 2) { 
            alert("Only 5 are allowed")
            counter--
            $(this).prop('checked', false)
            myModal.show()
        }
    })

   //add coins to modal
   const ModalAction = function () {
    $(".modal-body").html("")
    $(".form-check-input:checkbox:checked").each(function () {
        $(".modal-body").append($(this).parent().parent().clone().attr("aria-label", "Close").attr("data-bs-dismiss", "modal"))
    })
}

    //switch status action
    $(document).on("click", ".form-check-input:checkbox:not(:checked)", function () {
        counter--

        const coinsReturnStatus = $(`input[name="${$(this).attr('name')}"]`)
        coinsReturnStatus.prop('checked', false);

        $(".modal-body").html("")
    })


    //load modal function
    const myModal = new bootstrap.Modal(document.getElementById('staticBackdrop'), {
        backdrop: true
    })


    //function to load more coins info
    const loadMoreInfo = () => {
        $(".more-info-button").click(function () {

            $(this).next().collapse('toggle')

            if ($(this).next().children().length <= 0) {

                let id = ($(this).attr("id"))
                $("#Progress").show()

                $.ajax({

                    url: `https://api.coingecko.com/api/v3/coins/${id}`,
                    success: function (secondData) {
                        localStorageInfo(secondData)
                    }
                })

                //function to save data in localStorage + timeout
                const localStorageInfo = (secondData) => {
                    let object = {
                        usd: `${secondData.market_data.current_price.usd}`,
                        eur: `${secondData.market_data.current_price.eur}`,
                        ils: `${secondData.market_data.current_price.ils}`,
                        imgSrc: `${secondData.image.small}`,
                        symbol: `${secondData.symbol}`
                    }
                    localStorage.setItem(`object${secondData.symbol}`, JSON.stringify(object))
                    setTimeout(() => {
                        localStorage.clear()
                    }, 12000);

                    getMorInfo(secondData)
                    $("#Progress").hide()

                }



                //add data to collapse
                const getMorInfo = (secondData) => {
                    let jsonData = localStorage.getItem(`object${secondData.symbol}`)
                    object = JSON.parse(jsonData)

                    let morInfo = `
                  <div class="inner">
                  <p class="card-text" id="dollar">${object.usd}$</p>
                  <p class="card-text" id="euro">${object.eur}€</p>
                  <p class="card-text" id=shekel">${object.ils}₪</p>
                  <img src="${object.imgSrc}" alt="${object.symbol}">,
              </div>
                  `
                    $(this).next().append(morInfo)

                }
            } else {
                return
            }
        })

    }

    //filter coins action
    $("#filter").on("keyup", function () {
        let value = $(this).val().toLowerCase();
        $("#board div").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });

    //global function to ajax-jquery
    const getData = (url) => {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: url,
                success: data => resolve(data),
                error: arr => reject(arr)
            })
        })
    }
})

