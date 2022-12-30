


function addtocart(cartId){
    console.log('working')
  $.ajax({
    url:'/addtocart/'+cartId,
method:'get', 
success:()=>{
   swal({
        title: "Product added to Cart",
        icon: "success",
        confirmButtonText: "OK",
}).then(()=>{
location.reload()
})
}
  })
}



function removeProduct(cartId,productId){
 
$.ajax({
    url:'/removeproduct',
    data:{
          cartId:cartId,
          product:productId,
    },
    method:'post',
    success: () => {
        swal({
            title: "Product removed from cart",
            icon: "success",
            confirmButtonText: "OK",
        }).then(()=>{
        location.reload()
        })
    
}
})
}

