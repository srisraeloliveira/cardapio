document.addEventListener('DOMContentLoaded', function () {
    const itemList = document.getElementById('item-list');
    const cartList = document.getElementById('cart-list');
    const totalAmountElement = document.getElementById('total-amount');
    const addItemBtn = document.getElementById('add-item-btn');
    const removeAllBtn = document.getElementById('remove-all-btn');
    const modal = document.getElementById('modal');
    const saveItemBtn = document.getElementById('save-item-btn');
    const removeItemBtn = document.getElementById('remove-item-btn');
    const closeBtn = document.querySelector('.close');

    let totalAmount = 0;
    let editedItem = null;
    let defaultItem = null;

    itemList.addEventListener('click', function (event) {
        if (event.target.classList.contains('add-btn')) {
            const selectedItem = event.target.parentElement;
            addToCart(selectedItem);
        } else if (event.target.classList.contains('edit-btn')) {
            openModal(event.target.parentElement);
        }
    });

    cartList.addEventListener('click', function (event) {
        if (event.target.classList.contains('remove-btn')) {
            const removedItem = event.target.parentElement;
            removeFromCart(removedItem);
        }
    });

    addItemBtn.addEventListener('click', function () {
        openModal();
    });

    removeAllBtn.addEventListener('click', function () {
        removeAllItems();
    });

    saveItemBtn.addEventListener('click', function () {
        saveItem();
    });

    removeItemBtn.addEventListener('click', function () {
        removeItem();
    });

    closeBtn.addEventListener('click', function () {
        closeModal();
    });

    function addToCart(item) {
        const itemName = item.dataset.name;
        const itemPrice = parseFloat(item.dataset.price);

        // Verifica se o item já está no carrinho
        const existingCartItem = cartList.querySelector(`li[data-name="${itemName}"]`);

        if (existingCartItem) {
            // Se o item já estiver no carrinho, aumenta a quantidade
            const quantityElement = existingCartItem.querySelector('.quantity');
            const quantity = parseInt(quantityElement.textContent, 10);
            quantityElement.textContent = quantity + 1;
        } else {
            // Se o item não estiver no carrinho, adiciona à lista
            const newCartItem = document.createElement('li');
            newCartItem.dataset.name = itemName;
            newCartItem.dataset.price = itemPrice.toFixed(2);

            newCartItem.innerHTML = `
                <span>${itemName}</span>
                <span>R$ ${itemPrice.toFixed(2)}</span>
                <span class="quantity">1</span>
                <button class="remove-btn">Remover</button>
            `;

            cartList.appendChild(newCartItem);
        }

        // Adiciona o preço ao total
        totalAmount += itemPrice;
        totalAmountElement.textContent = totalAmount.toFixed(2);
    }

    function removeFromCart(item) {
        const itemName = item.dataset.name;
        const itemPrice = parseFloat(item.dataset.price);

        const quantityElement = item.querySelector('.quantity');
        const quantity = parseInt(quantityElement.textContent, 10);

        if (quantity > 1) {
            // Reduz a quantidade se houver mais de um item
            quantityElement.textContent = quantity - 1;
        } else {
            // Remove o item se houver apenas um
            item.remove();
        }

        // Subtrai o valor do item removido do total
        totalAmount -= itemPrice;

        // Atualiza o total do carrinho
        totalAmountElement.textContent = totalAmount.toFixed(2);

        // Se o carrinho estiver vazio, zera o total
        if (cartList.children.length === 0) {
            totalAmount = 0;
            totalAmountElement.textContent = totalAmount.toFixed(2);
        }
    }

    function removeAllItems() {
        // Remove todos os itens do cardápio
        while (itemList.firstChild) {
            itemList.removeChild(itemList.firstChild);
        }
    }

    function openModal(item) {
        modal.style.display = 'block';
        editedItem = item || null;

        if (editedItem) {
            // Se estiver editando, preenche os campos do modal com os dados do item
            document.getElementById('item-name').value = editedItem.dataset.name;
            document.getElementById('item-price').value = parseFloat(editedItem.dataset.price).toFixed(2);
        } else {
            // Se for um novo item, limpa os campos do modal
            document.getElementById('item-name').value = '';
            document.getElementById('item-price').value = '';
        }
    }

    function closeModal() {
        modal.style.display = 'none';
        editedItem = null; // Limpa a referência ao item editado
    }

    function saveItem() {
        const itemNameInput = document.getElementById('item-name');
        const itemPriceInput = document.getElementById('item-price');

        const newItemName = itemNameInput.value.trim();
        const newItemPrice = parseFloat(itemPriceInput.value);

        if (newItemName && !isNaN(newItemPrice) && newItemPrice > 0) {
            // Remove o item anterior (caso exista)
            if (editedItem) {
                editedItem.remove();
            }

            // Adiciona o item editado à lista
            const newItem = document.createElement('li');
            newItem.dataset.name = newItemName;
            newItem.dataset.price = newItemPrice.toFixed(2);

            newItem.innerHTML = `
                <span>${newItemName}</span>
                <span>R$ ${newItemPrice.toFixed(2)}</span>
                <button class="add-btn">Adicionar</button>
                <button class="edit-btn">Editar</button>
            `;

            itemList.appendChild(newItem);

            closeModal();
        }
    }

    function removeItem() {
        if (editedItem) {
            // Remove o item apenas se estiver editando (evita remover o item padrão)
            editedItem.remove();
            closeModal();
        }
    }
});
