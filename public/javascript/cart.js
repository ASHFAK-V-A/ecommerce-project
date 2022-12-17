
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
        alert('deleted')
    location.reload()
    
}
})
}

