const showMenu = (toggleId, navId) =>{
    const toggle = document.getElementById(toggleId),
    nav = document.getElementById(navId),
    cancel = document.getElementById('form-cancel')

    if(toggle && nav){
        toggle.addEventListener('click', () => {
            nav.classList.toggle('show-menu')
        })
     
        cancel.addEventListener('click', () => {
            nav.classList.toggle('show-menu').style.display = "none";
        })
    }
}




showMenu('form-toggle','form-menu')

const db = new Dexie('ShoppingApp')

db.version(1).stores({ items: '++id,name,price,isPurchased' })

const itemForm = document.getElementById('itemForm'),
itemsDiv = document.getElementById('itemsDiv'),
totalPriceDiv = document.getElementById('totalPriceDiv')

const populateItemsDiv = async () => {
    const allItems = await db.items.reverse().toArray()

    itemsDiv.innerHTML = allItems.map(item => `
    <div class="item ${item.isPurchased && 'purchased'}">
        <label>
            <input 
            type="checkbox" 
            class="checkbox"
            onchange="toggleItemStatus(event, ${item.id})"
            ${item.isPurchased && 'checked'} 
            >
        </label>

        <div class="itemInfo">
            <p>${item.name}</p>
            <p>$${item.price} x ${item.quantity}</p>
        </div>

        <button class="deleteButton" onclick="removeItem(${item.id})">
            <i class='bx bx-trash'></i>
        </button>
    </div>  
    `).join('')

    const arrayOfPrices = allItems.map(item => item.price * item.quantity)
    const totalPrice = arrayOfPrices.reduce((a, b) => a + b, 0)

    totalPriceDiv.innerText = 'Total price: #' + totalPrice
}

window.onload = populateItemsDiv

itemForm.onsubmit = async (event) => {
    event.preventDefault()

    const name = document.getElementById('nameInput').value,
    quantity = document.getElementById('quantityInput').value,
    price = document.getElementById('priceInput').value

    await db.items.add( {name, quantity, price} )
    await populateItemsDiv()

    itemForm.reset()
}

const toggleItemStatus = async (event, id) => {
    await db.items.update(id, {isPurchased: !!event.target.checked })
    await populateItemsDiv()
}

const removeItem = async (id) => {
    let text = "Are you sure you want to delete this item?"
    if (confirm(text) === true){
        await db.items.delete(id)
        await populateItemsDiv()
    } else{
    }
}
