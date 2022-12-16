

function changeQuantity(cartId, productId, count) {

    let quantity = parseInt(document.getElementById(productId).innerHTML);
    $.ajax({
      url: "/changeQuantity",
      data: {
        cart: cartId,
        product: productId,
        count: count,
        quantity: quantity
      },
      method: "post",
      success: (response) => {
        console.log(response);
        location.reload()
      }
    })
    
  }
  
function removeProduct(cartId,productId){
    console.log('remoce');
$.ajax({
    url:'/removeproduct',
    data:{
          cartId:cartId,
          product:productId,
    },
    method:'post',
    success: () => {
        swal({
          title: "Product removed from cart!",
          icon: "success",
          confirmButtonText: "OK",
          
        }).then(function () {

          location.reload();
        });
      },
    });
    
}


