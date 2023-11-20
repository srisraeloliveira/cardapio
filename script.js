document.addEventListener("DOMContentLoaded", function () {
    
  const itemList = document.getElementById("item-list");
  const cartList = document.getElementById("cart-list");
  const totalAmountElement = document.getElementById("total-amount");
  const addItemBtn = document.getElementById("add-item-btn");
  const removeAllBtn = document.getElementById("remove-all-btn");
  const modal = document.getElementById("modal");
  const saveItemBtn = document.getElementById("save-item-btn");
  const removeItemBtn = document.getElementById("remove-item-btn");
  const closeBtn = document.querySelector(".close");
  const completeOrderBtn = document.getElementById("complete-order-btn");
  const resetOrderBtn = document.getElementById("reset-order-btn");
  const clearCartBtn = document.getElementById("clear-cart-btn");
  const pedidoProntoBtn = document.getElementById("pedidoProntoBtn");

  let totalAmount = 0;
  let editedItem = null;
  let defaultItem = null;
  let orderCounter = 0;

  function markOrderAsReady() {
    // Lógica para marcar o pedido como pronto
    const pedidosContainer = document.getElementById("pedidos-container");

    if (pedidosContainer) {
      const pedidos = pedidosContainer.children;

      if (pedidos.length > 0) {
        // Marca o primeiro pedido como pronto
        const primeiroPedido = pedidos[0];
        primeiroPedido.classList.add("pedido-pronto");
      } else {
        console.error("Nenhum pedido na cozinha.");
      }
    } else {
      console.error(
        "Elemento 'pedidos-container' não encontrado na página da cozinha."
      );
    }
  }
  if (pedidoProntoBtn) {
      pedidoProntoBtn.addEventListener("click", function () {
        alert("Pedido marcado como pronto!"); // Exibe o alerta
        markOrderAsReady(); // Chama a função para marcar o pedido como pronto
        // Adicione mais lógica, se necessário
      });
  }

  completeOrderBtn.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    completeOrder();
    e.preventDefault();
    e.stopPropagation();
  });

  resetOrderBtn.addEventListener("click", function () {
    resetOrderCounter();
  });

  itemList.addEventListener("click", function (event) {
    if (event.target.classList.contains("add-btn")) {
      const selectedItem = event.target.parentElement;
      addToCart(selectedItem);
    } else if (event.target.classList.contains("edit-btn")) {
      openModal(event.target.parentElement);
    }
  });

  cartList.addEventListener("click", function (event) {
    if (event.target.classList.contains("remove-btn")) {
      const removedItem = event.target.parentElement;
      removeFromCart(removedItem);
    }
  });

  addItemBtn.addEventListener("click", function () {
    openModal();
  });

  removeAllBtn.addEventListener("click", function () {
    removeAllItems();
  });

  saveItemBtn.addEventListener("click", function () {
    saveItem();
  });

  removeItemBtn.addEventListener("click", function () {
    removeItem();
  });

  closeBtn.addEventListener("click", function () {
    closeModal();
  });

  clearCartBtn.addEventListener("click", function () {
    clearCart();
  });

  if (pedidoProntoBtn) {
    pedidoProntoBtn.addEventListener("click", function () {
        alert("Pedido marcado como pronto!"); // Adicione lógica adicional conforme necessário
      });    
  }

  function clearCart() {
    // Remove todos os itens do carrinho
    while (cartList.firstChild) {
      cartList.removeChild(cartList.firstChild);
    }

    // Zera o total
    totalAmount = 0;
    totalAmountElement.textContent = totalAmount.toFixed(2);
  }

  function addToCart(item) {
    const itemName = item.dataset.name;
    const itemPrice = parseFloat(item.dataset.price);

    // Verifica se o item já está no carrinho
    const existingCartItem = cartList.querySelector(
      `li[data-name="${itemName}"]`
    );

    if (existingCartItem) {
      // Se o item já estiver no carrinho, aumenta a quantidade
      const quantityElement = existingCartItem.querySelector(".quantity");
      const quantity = parseInt(quantityElement.textContent, 10);
      quantityElement.textContent = quantity + 1;
    } else {
      // Se o item não estiver no carrinho, adiciona à lista
      const newCartItem = document.createElement("li");
      newCartItem.dataset.name = itemName;
      newCartItem.dataset.price = itemPrice.toFixed(2);

      newCartItem.innerHTML = `
                  <span>${itemName}</span>
                  <span>AR$ ${itemPrice.toFixed(2)}</span>
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

    const quantityElement = item.querySelector(".quantity");
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
    modal.style.display = "block";
    editedItem = item || null;

    if (editedItem) {
      // Se estiver editando, preenche os campos do modal com os dados do item
      document.getElementById("item-name").value = editedItem.dataset.name;
      document.getElementById("item-price").value = parseFloat(
        editedItem.dataset.price
      ).toFixed(2);
    } else {
      // Se for um novo item, limpa os campos do modal
      document.getElementById("item-name").value = "";
      document.getElementById("item-price").value = "";
    }
  }

  function closeModal() {
    modal.style.display = "none";
    editedItem = null; // Limpa a referência ao item editado
  }

  function saveItem() {
    const itemNameInput = document.getElementById("item-name");
    const itemPriceInput = document.getElementById("item-price");

    const newItemName = itemNameInput.value.trim();
    const newItemPrice = parseFloat(itemPriceInput.value);

    if (newItemName && !isNaN(newItemPrice) && newItemPrice > 0) {
      // Remove o item anterior (caso exista)
      if (editedItem) {
        editedItem.remove();
      }

      // Adiciona o item editado à lista
      const newItem = document.createElement("li");
      newItem.dataset.name = newItemName;
      newItem.dataset.price = newItemPrice.toFixed(2);

      newItem.innerHTML = `
                  <span>${newItemName}</span>
                  <span>AR$ ${newItemPrice.toFixed(2)}</span>
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

  function generateOrderNumber() {
    // Aumenta o contador e retorna um número formatado entre 01 e 99
    orderCounter = (orderCounter % 99) + 1;
    return String(orderCounter).padStart(2, "0");
  }

  function completeOrder() {
    // Gera um número de pedido único
    const orderNumber = generateOrderNumber();

    // Cria uma cópia do pedido para a cozinha
    const kitchenOrders = GetOrdersForKitchen(orderNumber);

    // Limpa o carrinho após concluir o pedido
    clearCart();

    // Entrega o pedido ao cliente
    // alert(`Pedido concluído! Número do Pedido: ${orderNumber}`);

    // Envia a cópia para a cozinha
    displayKitchenOrder(orderNumber, kitchenOrders);
  }

  function GetOrdersForKitchen(orderNumber) {
    // Cria uma string simplificada do pedido para a cozinha
    // let simplifiedOrder = "";
    let orders = [];

    // Itera sobre os elementos diretamente no carrinho
    const cartItems = cartList.children;
    for (let i = 0; i < cartItems.length; i++) {
      const itemName = cartItems[i]
        .querySelector("span:first-child")
        .textContent.trim();
      const itemQuantity = cartItems[i]
        .querySelector(".quantity")
        .textContent.trim();

        orders.push({ descricao: itemName, quantidade: itemQuantity })
      // Adiciona o item simplificado à string para a cozinha
    //   simplifiedOrder += `Pedido #${orderNumber} - ${itemName} - Quantidade: ${itemQuantity}\n`;
    }

    return orders;
  }

  async function displayKitchenOrder(orderNumber, kitchenOrders) {
    const orderData = {
        numero: orderNumber,
        itens: kitchenOrders,
    };

    console.log(orderNumber, 'numero')

    try {
        fetch('http://localhost:3000/api/realtime-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({orderData}),
        })
        
    } catch (error) {
        console.error(error, 'erro fetch')        
    }

    // console.log(response.json());
    // .then(response => response.json())
    // .then(data => console.log(data))
    // .catch(error => console.error('Erro:', error));

    // Atualiza o conteúdo da div na página da cozinha
    // const pedidosContainer = document.getElementById("pedidos-container");

    // if (pedidosContainer) {
    //   const novoPedido = document.createElement("div");
    //   novoPedido.textContent = `Pedido #${orderNumber}:\n${kitchenOrder}`;
    //   pedidosContainer.appendChild(novoPedido);
    // } else {
    //   console.error(
    //     "Elemento 'pedidos-container' não encontrado na página da cozinha."
    //   );
    // }
  }

  function resetOrderCounter() {
    // Reseta o contador de números de pedidos
    orderCounter = 0;
    alert("Contador de Números de Pedido resetado!");
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const pedidoProntoBtn = document.getElementById("pedidoProntoBtn");

  if (pedidoProntoBtn) {
    pedidoProntoBtn.addEventListener("click", function () {
      alert("Pedido marcado como pronto!"); // Exibe o alerta
      markOrderAsReady(); // Chama a função para marcar o pedido como pronto
      // Adicione mais lógica, se necessário
    });
  } else {
    console.error(
      "Botão 'pedidoProntoBtn' não encontrado na página da cozinha."
    );
  }
});
