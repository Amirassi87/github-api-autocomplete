const keyword = document.getElementById("keyword");

const debounce = (cb, debounceTime = 1000) => {
    let timer;    
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          cb.apply(this,args);
        },debounceTime);
      }
};

const updateList = debounce(text =>{
    const val = text.toLowerCase();
    if(keyword.value == ""){
        const card = document.querySelector(".result-list");
        card.innerHTML = "";
    }else{
        fetch(`https://api.github.com/search/repositories?q=${val}`)
        .then(res => res.json())
        .then(data => {
            const card = document.querySelector(".result-list");
            for(let i=0; i < data.items.length ;i++){
                if(data.items[i].name.toLowerCase().includes(val)){
                    const item = document.createElement("div");
                    const name = document.createElement("a");

                    item.classList.add("result-list__item");
                    name.classList.add("result-list__item__name");

                    name.setAttribute("href","#")
                    name.textContent =  data.items[i].name;

                    item.append(name);
                    card.append(item);

                    let items = {
                        name:data.items[i].name,
                        Owner:data.items[i].owner.login,
                        Stars:data.items[i].stargazers_count,
                    }

                    name.addEventListener("click", (event) => {
                        localStorage.setItem(`items${i}`,JSON.stringify(items));
                        window.location.reload(true);
                    });
                }
            }
        }).catch((error) => console.error("Error:", error)); 

    }//end of if
})

keyword.addEventListener("input", e => {
    updateList(e.target.value);    
})//end of input event listener 

//display localStorage data
Object.entries(localStorage).forEach(([key, value]) => {

    const item = JSON.parse(value);

    const saved_list = document.querySelector(".saved-list");
    const container = document.querySelector(".container");

    const saved_list_container = document.createElement("div");
    saved_list_container.classList.add("saved-list__container");
    saved_list_container.classList.add("saved-list__container--d-flex");

    const saved_list_container_item = document.createElement("div");
    saved_list_container_item.classList.add("saved-list__container__item");
    saved_list_container_item.classList.add("saved-list__container__item--d-flex");
    
    const del_item = document.createElement("div");
    del_item.classList.add("saved-list__container__del");
    
    saved_list_container_item.innerHTML = `
        <div class="saved-list__container__item__name">Name: ${item.name}</div>
        <div class="saved-list__container__item__owner">Owner: ${item.Owner}</div>
        <div class="saved-list__container__item__stars">Stars: ${item.Stars}</div>
    `;

    del_item.innerHTML = `
        <button class="saved-list__container__del__link" type="button">X</button>
    `;

    saved_list_container.append(saved_list_container_item);
    saved_list_container.append(del_item);
    saved_list.append(saved_list_container);
    container.append(saved_list);

    del_item.addEventListener("click", () => {
        localStorage.removeItem(key);
        window.location.reload(true);
    });
});