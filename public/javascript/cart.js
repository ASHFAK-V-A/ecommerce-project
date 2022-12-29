


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

